import {
   where
} from "sequelize";
import db from "../models/index";
import emailService from './emailService';
import {
   v4 as uuidv4
} from 'uuid';
require('dotenv').config();

let buildUrlEmail = (doctorId, token) => {
   return `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
}

let postBookAppointment = (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!data.fullName || !data.email || !data.doctorId || !data.timeType || !data.date) {
            resolve({
               errorCode: 1,
               errorMessage: 'Missing required parameters !'
            })
         } else {
            let token = uuidv4();

            await emailService.sendSimpleEmail({
               receiverEmail: data.email,
               patientName: data.fullName,
               doctorName: data.doctorName,
               time: data.timeString,
               language: data.language,
               redirectLink: buildUrlEmail(data.doctorId, token)
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
            // console.log('data user', data);         
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
                     token: token
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

let postVerifyBookAppointment = (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!data.token || !data.doctorId) {
            resolve({
               errorCode: 1,
               errorMessage: 'Missing required parameters !'
            })
         } else {
            let appointment = await db.Booking.findOne({
               where: {
                  doctorId: data.doctorId,
                  token: data.token,
                  statusId: 'S1'
               },
               raw: false
            })

            // Check raw: false || true
            // console.log('Check raw', appointment);

            if (appointment) {
               appointment.statusId = 'S2';

               await appointment.save();

               resolve({
                  errorCode: 0,
                  errorMessage: 'Update the appointment succeed !'
               })
            } else {
               resolve({
                  errorCode: 2,
                  errorMessage: 'Appointment not found or already confirmed!'
               })
            }
         }
      } catch (error) {
         reject(error);
      }
   })
}

module.exports = {
   postBookAppointment: postBookAppointment,
   postVerifyBookAppointment: postVerifyBookAppointment,


}