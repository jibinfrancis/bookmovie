const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const User = require('../Model/userSchema')
const jwt = require('jsonwebtoken');
const CustomError = require("../Utils/CustomError");
const signToken = (id) => {
    return jwt.sign({id:id},process.env.SECRET_KEY,{
        expiresIn:process.env.EXPIRES_IN
    })
}
exports.createUser = asyncErrorHandler(async(req,res,next)=>{
    const user = await User.create(req.body)
    const token = signToken(user._id);
    res.status(200).json({
        status:'success',
        token,
        message:"User created successfully"
    })
})
exports.login = asyncErrorHandler(async(req,res,next)=>{
   const {email,password} = req.body
   if(!email || !password){
     const err = new CustomError('Please Provide Password and Email for logging in',400)
     return next(err)
   }
   const user = await User.findOne({email:email})
   const isMatch = await user.comparePasswordInDB(password,user.password)
   console.log("the user and isMatch value is",user,isMatch)
   if(!user || !isMatch){
    const err = new CustomError('Incorrect Email or Password.',400)
    return next(err)
   }
   const token = signToken(user._id);
   res.status(200).json({
    status:'success',
    token,
    data:user
})



})

exports.verify = asyncErrorHandler(async(req,res,next)=>{
    const {authorization} = req.headers
    let token;
    if(authorization && authorization.startsWith('Bearer')){
       token = authorization.split(' ')[1]
    }
    if(!authorization){
        const err = new CustomError('You are not logged in',401)
        return next(err)
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_KEY)
    const user = await User.findById(decodedToken?.id)
    if(!user){
        const err = new CustomError('You are not an authorized user',401)
        return next(err)
    }
    const passwordChanged = await user.isPasswordChanged(decodedToken.iat)
    
    
    if(passwordChanged){
        const err = new CustomError('Password Changed! Please try login again.')
        return next(err)
    }
    req.user = user
    next()

})
exports.restrict = (role) => {
    return (req, res, next) => {
        console.log("role req and response are", req, res, role)
        if (req.user.role !== role) {
            next(new CustomError('User has no permission to perform this action.', 403))
        }
        next()
    }
}