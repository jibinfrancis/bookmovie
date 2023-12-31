const express = require('express')
const moviesController = require('../Controllers/moviesController')
const userController = require('../Controllers/userController')
const theaterController = require('../Controllers/theaterController')
const router = express.Router()

router.route('/highestRated').get(userController.verify,moviesController.getHighedRatedMovies,moviesController.getMovies)
router.route('/').get(userController.verify,moviesController.getMovies)
    .post(userController.verify,moviesController.createMovies)
    .put(userController.verify,moviesController.updateMovie)
router.route('/:id').get(userController.verify,moviesController.getMovie)
    .delete(userController.verify,userController.restrict('admin'),moviesController.deleteMovie)
router.route('/bookMovie').put(userController.verify,moviesController.bookMovies)
router.route('/bookedMovies/:id').get(userController.verify,moviesController.getBookedMovies)
router.route('/allotMovies').post(userController.verify,theaterController.verifyTheaters,moviesController.allotMovies)
module.exports = router;