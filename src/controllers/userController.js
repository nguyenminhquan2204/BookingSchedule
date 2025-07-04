import db from '../models/index';
import userService from '../services/userService';

let handleLogin = async (req, res) => {
   let email = req.body.email;
   let password = req.body.password;

   // check email exist
   // compare password
   // return userInfor
   // access_token: JWT json web token

   if (!email || !password) {
      return res.status(500).json({
         errorCode: 1,
         message: "Missing inputs parameter!"
      })
   }

   let userData = await userService.handleUserLogin(email, password);

   return res.status(200).json({
      errorCode: userData.errorCode,
      message: userData.errorMessage,
      user: userData.user ? userData.user : {}
   })
}

let handleGetAllUsers = async (req, res) => {
   let id = req.body.id; //ALL or SINGLE

   if(!id) {
      return res.status(200).json({
         errorCode: 1,
         errorMessage: "Missing required parameters",
         users: []
      })
   }

   let users = await userService.getAllUsers(id);

   return res.status(200).json({
      errorCode: 0,
      errorMessage: 'OK',
      users: users
   })
}

module.exports = {
   handleLogin: handleLogin,
   handleGetAllUsers: handleGetAllUsers,

}