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

   return app.use("/", router);
}

module.exports = initWebRoutes;