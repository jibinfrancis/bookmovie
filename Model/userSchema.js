const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const Movie = require('./moviesSchema')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is Mandatory"]
    },
    email:{
        type:String,
        required:[true,"Email is Mandatory"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is Mandatory"]
    },
    confirmPassword:{
        type:String,
        required:[true,"confirmPassword is Mandatory"],
        validate:{
            validator:function(value){
                return this.password===value
            },
            message:"Password and confirm password should be same"
        }
    },
    passWordChangedAt:Date,
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    resetPassToken:String,
    bookedMovies:[{
        movie:{type:mongoose.Schema.Types.ObjectId,ref:Movie},
        bookedOn:{type:Date,default:Date.now()}
    }]

})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined
    next()
})
userSchema.methods.comparePasswordInDB = async(pass,dbpass)=>{
   return await bcrypt.compare(pass,dbpass)
}
userSchema.methods.isPasswordChanged = (jwtTimeStamp) =>{
    if(this.passWordChangedAt){
        const passwordChangedTimeStamp = parseInt(this.passWordChangedAt.getTime()/1000,10)
        return jwtTimeStamp < passwordChangedTimeStamp
    }
    return false
}
userSchema.methods.createResetPassToken = function(){
    this.resetPassToken
}
module.exports = mongoose.model('User',userSchema)