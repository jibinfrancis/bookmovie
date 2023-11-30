const mongoose = require('mongoose')
const transformId = require('../Utils/customResponseParser')

const theaterSchema = new mongoose.Schema({
   name:{
    type:String,
    required:[true,'Name is Mandatory']
   },
   location:{
    type:String,
    required:[true,'Location is Mandatory']
   },
   availableMovies:[{
    movie:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Movie'
    },
    showTime:Date
   }]
})
theaterSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        transformId(doc, ret);
    }
});
theaterSchema.set('toObject',{
    transform: function (doc, ret, options) {
        transformId(doc, ret);
    }
})

module.exports = mongoose.model('Theater',theaterSchema)