const CustomError = require("../Utils/CustomError")

module.exports = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500
    error.status = error.status || 'failed'
    if(error.name=='CastError'){
      console.log("entered in cast error",error)
      return res.status(400).json({
        status:400,
        message:`Invalid value for ${error.path} for field ${error.path}`
      })
    }
    res.status(error.statusCode).json({
      status:error.statusCode,
      message:error.message
    })

 }