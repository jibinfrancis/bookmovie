const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const Theater = require('../Model/theaterSchema');
const ApiFeatures = require("../Utils/ApiFeatures");

exports.createTheater = asyncErrorHandler(async(req,res,next)=>{
   const newTheater = await Theater.create(req.body)
   res.status(200).json({
     status:'success',
     data:newTheater
   })
})
exports.getTheaters = asyncErrorHandler(async(req,res,next)=>{
    const newTheater = new ApiFeatures(Theater.find(),req.query).filter().sort().limitFields()
    const results = await newTheater.query.populate({
        path:'availableMovies',
        populate: {
            path: 'movie',// Specify the model to use for populating the 'movie' field
            select:'_id id name'
          }
    }).exec()
    res.status(200).json({
        status:'success',
        data:{
            theaters:results
        }
    })

})
exports.verifyTheaters = asyncErrorHandler(async(req,res,next)=>{
    const {theaters} = req.body
    const isAllTheatersExist = await Theater.find({_id:{$in:theaters.map(item=>item.id)}})
    console.log("the theater exist is",isAllTheatersExist)
    if(isAllTheatersExist.length===theaters.length){
        next()
    }
    else{
       const nonExistingTheaters = theaters.filter(theater=>!isAllTheatersExist.find(item=>item.name==theater.name))
       return next(`Theater(s) not found`,404)
    }
})