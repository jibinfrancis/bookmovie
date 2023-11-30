const express = require('express');
const userController = require('../Controllers/userController')
const theaterController = require('../Controllers/theaterController')

const router = express.Router()

router.route('/').post(userController.verify,theaterController.createTheater)
.get(userController.verify,theaterController.getTheaters)


module.exports = router