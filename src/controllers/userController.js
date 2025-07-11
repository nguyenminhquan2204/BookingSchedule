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
   let id = req.query.id; //ALL or SINGLE

   if (!id) {
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

let handleCreateNewUser = async (req, res) => {
   let message = await userService.createNewUser(req.body);
   return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
   let data = req.body;
   let message = await userService.updateUser(data);
   return res.status(200).json(message);
}

let handleDeleteUser = async (req, res) => {
   if(!req.body.id) {
      return res.status(200).json({
         errorCode: 1,
         errorMessage: "Missing required parameters!"
      })
   }
   let message = await userService.deleteUser(req.body.id);
   return res.status(200).json(message);
}

let getAllCode = async (req, res) => {
   try {
      let data = await userService.getAllCodeService(req.query.type);
      return res.status(200).json(data);
   } catch (exception) {
      // console.log('Get all code error : ', exception);
      return res.status(200).json({
         errorCode: -1,
         errorMessage: 'Error from server'
      })
   }
}

module.exports = {
   handleLogin: handleLogin,
   handleGetAllUsers: handleGetAllUsers,
   handleCreateNewUser: handleCreateNewUser,
   handleEditUser: handleEditUser,
   handleDeleteUser: handleDeleteUser,
   getAllCode: getAllCode,

}