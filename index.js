import mongoose from "mongoose";
import express from "express";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import Route from "./route/route.js";

const App = express();
App.use(cors());
App.use(bodyParser.json());
configDotenv();

let PORT = process.env.PORT || 7000;
let URL = process.env.URL;

mongoose.connect(URL).then(()=>{
  console.log("database connected successfully");
  App.listen(PORT,()=>{
    console.log(`app connected on port ${PORT}`);
    
  })
  
}).catch((error)=>console.log(error));

App.use("/api", Route);
App.use('/uploads', express.static('uploads'));