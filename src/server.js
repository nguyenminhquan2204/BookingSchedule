import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from 'cors';

require(`dotenv`).config();

let app = express();
app.use(cors({ origin: true }));
// config app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 4444;
// Port === undefined => port = 4444

app.listen(port, () => {
   console.log("Backend Nodejs is running on the port : " + port);
});