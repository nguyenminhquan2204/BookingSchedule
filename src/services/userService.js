import db from "../models/index";
import bcrypt from "bcryptjs";

let handleUserLogin = (email, password) => {
   return new Promise(async (resolve, reject) => {
      try {
         let userData = {};
         let isExist = await checkUserEmail(email);

         if (isExist) {
            // user already exist
            // compare password
            let user = await db.User.findOne({
               attributes: ['email', 'roleId', 'password'],
               where: {
                  email: email
               },
               raw: true
            });

            if (user) {
               let check = await bcrypt.compareSync(password, user.password);
               if (check) {
                  userData.errorCode = 0;
                  userData.errorMessage = 'Ok';

                  // console.log(user);
                  delete user.password;
                  userData.user = user;
               } else {
                  userData.errorCode = 3;
                  userData.errorMessage = 'Wrong password';
               }
            } else {
               userData.errorCode = 2;
               userData.errorMessage = `User's not found`
            }
         } else {
            // return error
            userData.errorCode = 1;
            userData.errorMessage = `Your's email isn't exist in your system. Plz try other email!`;
         }

         resolve(userData);
      } catch (error) {
         reject(error)
      }
   })
}

let checkUserEmail = (userEmail) => {
   return new Promise(async (resolve, reject) => {
      try {
         let user = await db.User.findOne({
            where: {
               email: userEmail
            }
         })

         if (user) {
            resolve(true)
         } else {
            resolve(false);
         }
      } catch (error) {
         reject(error)
      }
   })
}

let getAllUsers = (userId) => {
   return new Promise(async (resolve, reject) => {
      try {
         let users = '';
         if (userId === 'ALL') {
            users = await db.User.findAll({
               attributes: {
                  exclude: ['password']
               }
            });
         }
         if (userId && userId !== 'ALL') {
            users = await db.User.findOne({
               where: {
                  id: userId
               },
               attributes: {
                  exclude: ['password']
               }
            });
         }
         resolve(users);
      } catch (error) {
         reject(error);
      }
   })
}

module.exports = {
   handleUserLogin: handleUserLogin,
   getAllUsers: getAllUsers,

}