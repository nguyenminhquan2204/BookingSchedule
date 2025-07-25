import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
   router.get("/", (req, res) => {
      return res.send("Hello Quan");
   });

   router.get("/home", homeController.getHomePage);

   router.get("/crud", homeController.getCRUD);

   router.post("/post-crud", homeController.postCRUD);

   router.get('/get-crud', homeController.displayGetCRUD);

   router.get('/edit-crud', homeController.getEditCRUD);

   router.post('/put-crud', homeController.putCRUD);

   router.get('/delete-crud', homeController.deleteCRUD);

   router.post('/api/login', userController.handleLogin)

   router.get('/api/get-all-users', userController.handleGetAllUsers);

   router.post('/api/create-new-user', userController.handleCreateNewUser);

   router.put('/api/edit-user', userController.handleEditUser);

   router.delete('/api/delete-user', userController.handleDeleteUser);

   router.get('/allcode', userController.getAllCode);

   return app.use("/", router);
}

module.exports = initWebRoutes;