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

module.exports = {
   getTopDoctorHomeService: getTopDoctorHomeService,

}