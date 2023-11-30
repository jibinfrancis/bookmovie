const express = require('express');
const fs = require('fs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const moviesRoutes = require('./Routes/movieRoutes')
const errorController = require('./Controllers/errorController')
const userRoutes = require('./Routes/userRoutes')
const theaterRoutes = require('./Routes/theaterRoutes')
const dotenv = require('dotenv');
const CustomError = require('./Utils/CustomError');
dotenv.config({path:'./config.env'})
let app = express()
app.use(bodyParser.json())
// const moviesData = JSON.parse(fs.readFileSync('./data/movies.json'))
const moviesData = []
console.log("the conn url is",process.env.DB_URL)
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser:true
}).then((conn)=>{
//    console.log(conn)
   console.log("connection successfull")
}).catch(err=>{
    console.log("db connection failed",err)
})
// app.use(customResponseParser)
app.use('/api/v1/auth',userRoutes)
app.use('/api/v1/movies',moviesRoutes)
app.use('/api/v1/theaters',theaterRoutes)
app.all('*',(req,res,next)=>{
//    res.json({
//     status:"failed",
//     message:`Requested url(${req.originalUrl}) not found`
//    })
     const err = new CustomError(`Requested url(${req.originalUrl}) not found`,404)
     next(err);
})
app.use(errorController)
app.listen(process.env.PORT,()=>{
    console.log("the server got started")
})