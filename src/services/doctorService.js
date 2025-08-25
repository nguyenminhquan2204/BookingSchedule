import {
   where
} from 'sequelize';
import db from '../models/index';
import _, {
   includes,
   reject
} from 'lodash';
require('dotenv').config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHomeService = (limit) => {
   return new Promise(async (resolve, reject) => {
      try {
         let users = await db.User.findAll({
            limit: limit,
            where: {
               roleId: 'R2'
            }, // Assuming R2 is the role for doctors
            order: [
               ['createdAt', 'DESC']
            ],
            attributes: {
               exclude: ['password']
            },
            include: [{
                  model: db.Allcode,
                  as: 'positionData',
                  attributes: ['valueVi', 'valueEn']
               },
               {
                  model: db.Allcode,
                  as: 'genderData',
                  attributes: ['valueVi', 'valueEn']
               }
            ],
            raw: true,
            nest: true
         });

         resolve({
            errorCode: 0,
            data: users
         })
      } catch (error) {
         reject(error);
      }
   });
}

let getAllDoctorsService = () => {
   return new Promise(async (resolve, reject) => {
      try {
         let doctors = await db.User.findAll({
            where: {
               roleId: 'R2'
            }, // Assuming R2 is the role for doctors
            attributes: {
               exclude: ['password', 'image']
            }
         })
         resolve({
            errorCode: 0,
            data: doctors
         });
      } catch (error) {
         reject(error);
      }
   })
}

let saveDetailInfoDoctor = (data) => {
   return new Promise(async (resolve, reject) => {
      // console.log('Check backend:', data);
      try {
         if (!data.doctorId || !data.contentHTML || !data.contentMarkdown || !data.action ||
            !data.selectedPrice || !data.selectedPayment || !data.selectedProvince ||
            !data.nameClinic || !data.addressClinic || !data.note
         ) {
            resolve({
               errorCode: 1,
               errorMessage: 'Missing parameters!'
            })
         } else {
            // upsert to Markdown table
            if (data.action === 'CREATE') {
               await db.Markdown.create({
                  contentHTML: data.contentHTML,
                  contentMarkdown: data.contentMarkdown,
                  description: data.description,
                  doctorId: data.doctorId
               });
            } else if (data.action === 'EDIT') {
               let doctorMarkdown = await db.Markdown.findOne({
                  where: {
                     doctorId: data.doctorId
                  },
                  raw: true
               })

               if (doctorMarkdown) {
                  await db.Markdown.update({
                     contentHTML: data.contentHTML,
                     contentMarkdown: data.contentMarkdown,
                     description: data.description,
                  }, {
                     where: {
                        doctorId: data.doctorId
                     }
                  });
               }
            }

            // upsert to doctor_infor table
            let doctorInfor = await db.Doctor_Infor.findOne({
               where: {
                  doctorId: data.doctorId
               },
               raw: false
            })

            if (doctorInfor) {
               // update
               await db.Doctor_Infor.update({
                  doctorId: data.doctorId,
                  priceId: data.selectedPrice.value,
                  provinceId: data.selectedProvince.value,
                  paymentId: data.selectedPayment.value,
                  nameClinic: data.nameClinic,
                  addressClinic: data.addressClinic,
                  note: data.note
               }, {
                  where: {
                     doctorId: data.doctorId
                  }
               });
            } else {
               // create
               await db.Doctor_Infor.create({
                  doctorId: data.doctorId,
                  priceId: data.selectedPrice.value,
                  provinceId: data.selectedProvince.value,
                  paymentId: data.selectedPayment.value,
                  nameClinic: data.nameClinic,
                  addressClinic: data.addressClinic,
                  note: data.note
               });
            }

            resolve({
               errorCode: 0,
               errorMessage: 'Save info doctor succeed !'
            })
         }
      } catch (error) {
         reject(error);
      }
   });
}

let getDetailDoctorById = (id) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!id) {
            resolve({
               errorCode: 1,
               errorMessage: 'Missing required parameters!'
            })
         } else {
            let data = await db.User.findOne({
               where: {
                  id: id
               },
               attributes: {
                  exclude: ['password']
               },
               include: [{
                     model: db.Markdown,
                     attributes: ['description', 'contentHTML', 'contentMarkdown']
                  },
                  {
                     model: db.Allcode,
                     as: 'positionData',
                     attributes: ['valueVi', 'valueEn']
                  },
                  {
                     model: db.Doctor_Infor,
                     attributes: {
                        exclude: ['id', 'doctorId'] //exclude: ngoai tru 
                     },
                     include: [{
                           model: db.Allcode,
                           as: 'priceTypeData',
                           attributes: ['valueEn', 'valueVi']
                        },
                        {
                           model: db.Allcode,
                           as: 'provinceTypeData',
                           attributes: ['valueEn', 'valueVi']
                        },
                        {
                           model: db.Allcode,
                           as: 'paymentTypeData',
                           attributes: ['valueEn', 'valueVi']
                        },
                     ]
                  }
               ],
               raw: false,
               nest: true
            });

            if (data && data.image) {
               data.image = new Buffer(data.image, 'base64').toString('binary');
            }

            if (!data) data = {}

            resolve({
               errorCode: 0,
               data: data
            })
         }
      } catch (error) {
         reject(error);
      }
   })
}

let bulkCreateSchedule = (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!data.arrSchedule || !data.doctorId || !data.date) {
            resolve({
               errorCode: 1,
               errorMessage: 'Missing required parameters!'
            })
         } else {
            let schedule = data.arrSchedule;
            // console.log("Data send: ", schedule);
            // console.log("Data type send: ", typeof schedule);

            if (schedule && schedule.length > 0) {
               schedule = schedule.map(item => {
                  item.maxNumber = MAX_NUMBER_SCHEDULE;
                  return item;
               })
            }

            // console.log("Schedule", schedule);

            let existing = await db.Schedule.findAll({
               where: {
                  doctorId: data.doctorId,
                  date: data.date
               },
               attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
               raw: true
            });

            // compare different
            let toCreate = _.differenceWith(schedule, existing, (a, b) => {
               return a.timeType === b.timeType && +a.date === +b.date;
            });
            // console.log('To create', toCreate);

            // create data
            if (toCreate && toCreate.length > 0) {
               await db.Schedule.bulkCreate(toCreate);
            }

            resolve({
               errorCode: 0,
               errorMessage: 'Create schedule succeed!'
            })
         }
      } catch (error) {
         reject(error);
      }
   })
}

let getScheduleByDate = (doctorId, date) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!doctorId || !date) {
            resolve({
               errorCode: 1,
               errorMessage: 'Missing required parameters!'
            })
         } else {
            let dataSchedule = await db.Schedule.findAll({
               where: {
                  doctorId: doctorId,
                  date: date
               },
               include: [{
                     model: db.Allcode,
                     as: 'timeTypeData',
                     attributes: ['valueEn', 'valueVi']
                  },
                  {
                     model: db.User,
                     as: 'doctorData',
                     attributes: ['firstName', 'lastName']
                  }
               ],
               raw: false,
               next: true
            })

            if (!dataSchedule) dataSchedule = []

            resolve({
               errorCode: 0,
               data: dataSchedule
            })
         }
      } catch (error) {
         reject(error);
      }
   });
}

let getExtraInforDoctorById = (id) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!id) {
            resolve({
               errorCode: 1,
               errorMessage: 'Missing required parameter!'
            })
         } else {
            let data = await db.Doctor_Infor.findOne({
               where: {
                  doctorId: id
               },
               attributes: {
                  exclude: ['id', 'doctorId'] //Khong lay 2 cot: id, doctorId
               },
               include: [{
                     model: db.Allcode,
                     as: 'priceTypeData',
                     attributes: ['valueEn', 'valueVi']
                  },
                  {
                     model: db.Allcode,
                     as: 'provinceTypeData',
                     attributes: ['valueEn', 'valueVi']
                  },
                  {
                     model: db.Allcode,
                     as: 'paymentTypeData',
                     attributes: ['valueEn', 'valueVi']
                  },
               ],
               raw: false,
               next: true
            })

            if (!data) data = {}

            resolve({
               errorCode: 0,
               data: data
            })
         }
      } catch (error) {
         reject(error);
      }
   })
}

let getProfileDoctorById = (id) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!id) {
            resolve({
               errorCode: 1,
               errorMessage: "Missing required parameter!"
            })
         } else {
            let data = await db.User.findOne({
               where: {
                  id: id
               },
               attributes: {
                  exclude: ['password']
               },
               include: [{
                     model: db.Markdown,
                     attributes: ['description', 'contentHTML', 'contentMarkdown']
                  },
                  {
                     model: db.Allcode,
                     as: 'positionData',
                     attributes: ['valueVi', 'valueEn']
                  },
                  {
                     model: db.Doctor_Infor,
                     attributes: {
                        exclude: ['id', 'doctorId'] //exclude: ngoai tru 
                     },
                     include: [{
                           model: db.Allcode,
                           as: 'priceTypeData',
                           attributes: ['valueEn', 'valueVi']
                        },
                        {
                           model: db.Allcode,
                           as: 'provinceTypeData',
                           attributes: ['valueEn', 'valueVi']
                        },
                        {
                           model: db.Allcode,
                           as: 'paymentTypeData',
                           attributes: ['valueEn', 'valueVi']
                        },
                     ]
                  }
               ],
               raw: false,
               nest: true
            });

            if (data && data.image) {
               data.image = new Buffer(data.image, 'base64').toString('binary');
            }
            if (!data) data = {}

            resolve({
               errorCode: 0,
               data: data
            })
         }
      } catch (error) {
         reject(error);
      }
   })
}

module.exports = {
   getTopDoctorHomeService: getTopDoctorHomeService,
   getAllDoctorsService: getAllDoctorsService,
   saveDetailInfoDoctor: saveDetailInfoDoctor,
   getDetailDoctorById: getDetailDoctorById,
   bulkCreateSchedule: bulkCreateSchedule,
   getScheduleByDate: getScheduleByDate,
   getExtraInforDoctorById: getExtraInforDoctorById,
   getProfileDoctorById: getProfileDoctorById,

}