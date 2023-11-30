const { default: mongoose } = require('mongoose')
const Movie = require('../Model/moviesSchema')
const User = require('../Model/userSchema')
const Theater = require('../Model/theaterSchema')
const ApiFeatures = require('../Utils/ApiFeatures')
const asyncErrorHandler = require('../Utils/asyncErrorHandler')
const CustomError = require('../Utils/CustomError')
const moviesData = []
exports.getMovies = asyncErrorHandler(async (req, res) => {
    //    const moviesData = await Movie.find(req.query)
       console.log("the query object is",req.query)
    //    const fieldsToExclude = ['sort','fields','page','size']
    //    const queryParams  = {...req.query}
    //    if(queryParams){
    //     fieldsToExclude.forEach(field=>{
    //         delete queryParams[field]
    //     })
    //    }
       let query = new ApiFeatures(Movie.find(),req.query).filter().sort().limitFields().paginate()
    //    .sort().limitFields().paginate()

    //    if(req?.query?.sort){
    //       query = query.sort(req.query.sort.split(',').join(' '))
    //    }
    //    else{
    //     query = query.sort('-createdAt')
    //    }
    //    if(req?.query?.fields){
    //     query = query.select(req.query.fields.split(',').join(' '))
    //    }
    //    else{
    //     query = query.select('-__v')
    //    }
       const page = req?.query?.page || 1
       const limit = req?.query?.size || 10
       const skip = limit*(page-1)
    //    console.log("the query data is",query)
    //    query = query.skip(limit*(page-1)).limit(limit)
       if(req?.query?.page){
        const movieCount = await Movie.countDocuments()
        if(skip>=movieCount){
            throw new Error('This page is not found')
        }
       }
       const moviesData = await query.query.populate({
        path: 'availableTheaters',
        select: 'name location id'
      }).exec()
       res.status(200).json({
        status: "success",
        data: {
            movies: moviesData
        }
    })
})
exports.getHighedRatedMovies = async(req,res,next) => {
    req.query.size=5
    req.query.sort="-rating"
    next()
}
exports.getMovie = asyncErrorHandler(async(req,res,next) => {
        // const movieData = await Movie.find({_id:req?.params?.id})
        const movieData = await Movie.findById(req?.params?.id)
        if (!movieData) {
            const err = new CustomError("Movie Not Found",404)
            return next(err)
        }
        res.status(200).json({
            status: "success",
            data: {
                movie: movieData
            }
            })
})
exports.updateMovie = asyncErrorHandler(async(req,res) => {
        const updatedMovie = await Movie.findByIdAndUpdate(req.body.id,req.body,{new:true,runValidators:true})
        if (!updatedMovie) {
            return res.status(404).json({
                status: "failed",
                message: 'Movie not found'
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                movie: updatedMovie
            }
            })
    
})
exports.deleteMovie = asyncErrorHandler(async(req,res) => {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id)
        if (!deletedMovie) {
            return res.status(404).json({
                status: "failed",
                message: 'Movie not found'
            });
        }
        console.log("deleted movie",deletedMovie)
        res.status(200).json({
            status: "success",
            message:"Movie Deleted Successfully"
            })
})
// exports.createMovies = (req,res)=>{
//     console.log(req.body,req.url)
//     const newId = moviesData.length+1
//     moviesData.push(req.body)
//     fs.writeFile('./data/movies.json',JSON.stringify(moviesData),()=>{
//         res.status(200).json({
//             status:"success",
//             data:{
//                 movies:req.body
//             }
//         })
//     })
// }

exports.createMovies = asyncErrorHandler(async(req, res) => {
        const newMovie = await Movie.create(req.body)
        res.status(200).json({
                        status:"success",
                        data:{
                            movies:newMovie
                        }
                    })

})
exports.bookMovies = asyncErrorHandler(async(req,res)=>{
    const {id,userId} =  req.body
    const {ObjectId} = mongoose.Types
    const bookingDetails = {
        movie: new ObjectId(id)
    }
    const updatedMovie = await User.findByIdAndUpdate(userId,{ $push: { bookedMovies: bookingDetails } },{new:true,runValidators:true})
    if(!updatedMovie){
       return next(new CustomError('User not found',404))
    }
    res.status(201).json({
        status:'Success',
        message:'Updated Successfully'
    })
})
exports.getBookedMovies = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params
    const bookedMovies = await User.findById(id).populate({
        path: 'bookedMovies',
        populate: {
          path: 'movie',
          model: 'Movie' // Specify the model to use for populating the 'movie' field
        }
      }).exec()
    if(!bookedMovies){
        return next(new CustomError('No movies found',404))
    }
    res.status(200).json({
        status:'Success',
        data:{
            movies:bookedMovies?.bookedMovies
        }
    })
})
exports.allotMovies = asyncErrorHandler(async(req,res,next)=>{
    const {movieId,theaters} = req.body
    const {ObjectId} = mongoose.Types
    const updateMovies = await Movie.findByIdAndUpdate(movieId,{$push:{availableTheaters:theaters.map(item=>new ObjectId(item.id))}})
    console.log("entered after update movies",theaters,movieId)
    if(!updateMovies){
        return next('Movie not found',404)
    }
    const allTheaters = await Theater.find();
    allTheaters.forEach(async(theater,index)=>{
       console.log("the item id and theater id",theater.id)
       const findTheater =  theaters.find(item=>item.id===theater.id)
       if(findTheater){
         theater.availableMovies.push({
            movie: new ObjectId(movieId),
            showTime:findTheater.showTime
         })
         try {
            await theater.save();
          } catch (error) {
            return next(new CustomError('error saving theater'))
          }
       }
    })

    res.status(200).json({
        status:"success",
        data:updateMovies
    })
})
