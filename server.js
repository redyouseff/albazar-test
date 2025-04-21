const express=require("express");
const dotenv=require("dotenv")
const  cors=require("cors");
const compression=require("compression")
const path =require("path");
const {appError}=require("./utilts/appError")
const {dbConnection}=require('./config/dbConnection');
const { globelError } = require("./middlewares/globelError");
const mountRoute = require("./routes/mainRoute");
const { app, server } = require("./config/socker");
const { Vonage } = require('@vonage/server-sdk')




app.use(cors())
app.options("*",cors())
dotenv.config({path:"config.env"})
app.use(compression());
app.use(express.static(path.join(__dirname,"uploads")))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


  server.listen(process.env.PORT,(req,res)=>{
    

    console.log(`app listen on port ${process.env.PORT}`,process.env.NODE_ENV);


})  

dbConnection();




mountRoute(app)




app.use("*",(req,res,next)=>{
    next(new appError(`cant find this url ${req.originalUrl}`,400))
})


app.use(globelError)





