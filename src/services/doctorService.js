import db from '../models/index';

let getTopDoctorHomeService = (limit) => {
   return new Promise(async (resolve, reject) => {
      try {
         let users = await db.User.findAll({
            limit: limit,
            where: { roleId: 'R2' }, // Assuming R2 is the role for doctors
            order: [['createdAt', 'DESC']],
            attributes: {
               exclude: ['password']
            },
            include: [
               { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
               { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn'] }
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
            where: { roleId: 'R2' }, // Assuming R2 is the role for doctors
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
      try {
         if(!data.doctorId || !data.contentHTML || !data.contentMarkdown) {
            resolve({
               errorCode: 1,
               errorMessage: 'Missing parameters!'
            })
         } else {
            await db.Markdown.create({
               contentHTML: data.contentHTML,
               contentMarkdown: data.contentMarkdown,
               description: data.description,
               doctorId: data.doctorId
            });

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
         if(!id) {
            resolve({
               errorCode: 1,
               errorMessage: 'Missing required parameters!'
            })
         } else {
            let data = await db.User.findOne({
               where: { id: id},
               attributes: {
                  exclude: ['password', 'image']
               }, 
               include: [
                  { 
                     model: db.Markdown, 
                     attributes: ['description', 'contentHTML', 'contentMarkdown'] 
                  },
                  {
                     model: db.Allcode,
                     as: 'positionData',
                     attributes: ['valueVi', 'valueEn']
                  }
               ],
               raw: true,
               nest: true
            });

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

}