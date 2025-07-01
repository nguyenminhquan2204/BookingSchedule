import db from '../models/index';
import CRUDServices from '../services/CRUDService';

let getHomePage = async (req, res) => {
   try {
      let data = await db.User.findAll();

      return res.render('homepage.ejs', {
         data: JSON.stringify(data),

      });
   } catch (error) {
      console.log(error);
   }
}

let getCRUD = async (req, res) => {
   return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
   // console.log(req.body);
   let message = await CRUDServices.createNewUser(req.body);
   return res.send(message);
}

let displayGetCRUD = async (req, res) => {
   let data = await CRUDServices.getAllUser();

   return res.render('displayCRUD.ejs', {
      dataTable: data
   })
}

let getEditCRUD = async (req, res) => {
   let userId = req.query.id;

   if (userId) {
      let userData = await CRUDServices.getUserInfoById(userId);

      return res.render('editCRUD.ejs', {
         user: userData
      });
   } else {
      return res.send("User not Found");
   }
}

let putCRUD = async (req, res) => {
   let data = req.body;
   let allUsers = await CRUDServices.updateUserData(data);

   return res.render('displayCRUD.ejs', {
      dataTable: allUsers
   });
}

let deleteCRUD = async (req, res) => {
   let userId = req.query.id;
   if (userId) {
      await CRUDServices.deleteUserById(userId);
      return res.redirect('/get-crud');
   } else {
      return res.send('User not found !');
   }
}

module.exports = {
   getHomePage: getHomePage,
   getCRUD: getCRUD,
   postCRUD: postCRUD,
   displayGetCRUD: displayGetCRUD,
   getEditCRUD: getEditCRUD,
   putCRUD: putCRUD,
   deleteCRUD: deleteCRUD,

}