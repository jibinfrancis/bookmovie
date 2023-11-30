const mongoose = require('mongoose');
const Theater = require('../Model/theaterSchema')
const transformId = require('../Utils/customResponseParser')
const moviesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:String,
    duration:{
        type:Number,
        required:[true,'Duration is required']
    },
    rating:{
        type:Number,
        min:1,
        max:[10,'Rating should be less than 10.0']
    },
    createdAt:{
        type:Date,
        default:Date.now()

    },
    availableTheaters:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:Theater
        }
    ]
},{
    toJSON:{virtuals:true,transform: function (doc, ret) {
        // Transform the _id field to id
        transformId(doc, ret);
      }
    },
    toObject:{virtuals:true,transform: function (doc, ret) {
        // Transform the _id field to id
        transformId(doc, ret);
      }}
})
// moviesSchema.set('toJSON', {
//     transform: function (doc, ret, options) {
//         ret.id = ret._id;
//         delete ret._id;
//         delete ret.__v;
//     }
// })
// moviesSchema.virtual('durationInHours').get(function(){
//     return this.duration/60
// })
module.exports = mongoose.model('Movie',moviesSchema)