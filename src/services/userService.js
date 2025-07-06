import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

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

let hashUserPassword = (password) => {
   return new Promise(async (resolve, reject) => {
      try {
         let hashPassword = await bcrypt.hashSync(password, salt);
         resolve(hashPassword);
      } catch (error) {
         reject(error);
      }
   });
}

let createNewUser = (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         // Check email is exist
         let check = await checkUserEmail(data.email);
         if (check === true) {
            resolve({
               errorCode: 1,
               message: "Your email is already in used. Please try another email"
            })
         }
         else {
            let hashPasswordFromBrcrypt = await hashUserPassword(data.password);
            await db.User.create({
               email: data.email,
               password: hashPasswordFromBrcrypt,
               firstName: data.firstName,
               lastName: data.lastName,
               address: data.address,
               phoneNumber: data.phoneNumber,
               gender: data.gender === '1' ? true : false,
               roleId: data.roleId,
            })

            resolve({
               errorCode: 0,
               message: 'OK',
            });
         }
      } catch (error) {
         reject(error)
      }
   });
}

let deleteUser = (userId) => {
   return new Promise(async (resolve, reject) => {
      try {
         let foundUser = await db.User.findOne({
            where: {
               id: userId
            }
         })
         if (!foundUser) {
            resolve({
               errorCode: 2,
               errorMessage: `The user isn't exist`
            })
         }

         await db.User.destroy({
            where: {
               id: userId
            }
         });

         resolve({
            errorCode: 0,
            message: `The user is deleted`
         })
      } catch (error) {
         reject(error);
      }
   })
}

let updateUser = (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         if(!data.id) {
            resolve({
               errorCode: 2,
               errorMessage: 'Missing required parameters'
            })
         }
         let user = await db.User.findOne({
            where: { id: data.id },
            raw: false
         })
         if(user) {
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.address = data.address;

            await user.save();

            resolve({
               errorCode: 0,
               message: 'Update the user success!'
            })
         } else {
            resolve({
               errorCode: 1,
               errorCode: 'User not found'
            })
         }
      } catch (error) {
         reject(error);
      }
   })
}

module.exports = {
   handleUserLogin: handleUserLogin,
   getAllUsers: getAllUsers,
   createNewUser: createNewUser,
   deleteUser: deleteUser,
   updateUser: updateUser,

}