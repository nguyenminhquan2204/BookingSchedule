import db from "../models/index";
import emailService from './emailService';
require('dotenv').config();

let postBookAppointment = (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!data.email || !data.doctorId || !data.timeType || !data.date) {
            resolve({
               errorCode: 1,
               errorMessage: 'Missing required parameters !'
            })
         } else {
            await emailService.sendSimpleEmail({
               receiverEmail: data.email,
               patientName: 'Chi',
               doctorName: 'Quan',
               time: 'asd',
               redirectLink: 'https://www.youtube.com/'
            });

            // upsert patient
            let user = await db.User.findOrCreate({
               where: {
                  email: data.email
               },
               defaults: {
                  email: data.email,
                  roleId: 'R3'
               },
               raw: true
            })

            // Create a booking record
            // console.log('data user', user[0]);
            if (user && user[0]) {
               await db.Booking.findOrCreate({
                  where: {
                     patientId: user[0].id
                  },
                  defaults: {
                     statusId: 'S1',
                     doctorId: data.doctorId,
                     patientId: user[0].id,
                     date: data.date,
                     timeType: data.timeType,
                  },
               })
            }

            resolve({
               errorCode: 0,
               errorMessage: 'Save infor patient succeed!',
            })
         }
      } catch (error) {
         reject(error);
      }
   })
}

module.exports = {
   postBookAppointment: postBookAppointment

}