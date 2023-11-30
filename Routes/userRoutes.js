const express = require('express')
const router = express.Router()
const userController = require('../Controllers/userController')

router.route('/signup').post(userController.createUser)
router.route('/login').post(userController.login)
module.exports = router;