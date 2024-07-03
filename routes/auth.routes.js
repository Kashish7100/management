const express = require('express')
const user = require('../controllers/user.controller.js')
const router = express.Router()

router.post('/logincheck', user.loginCheck)
router.post('/forgotpassword', user.forgotpassword)
router.post('/register', user.register)
router.post('/emailCheck', user.emailCheck)
router.post('/icNumberCheck', user.icnumberCheck)

module.exports = router
