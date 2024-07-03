const express = require('express')
const passport = require('passport')
const user = require('../controllers/user.controller.js')
const router = express.Router()
const rolePermissionCheck = require('../middleware/rolePermissionCheckMiddleware.js')

// Apply JWT authentication middleware to all routes in secureRouter
router.use(passport.authenticate('jwt', { session: false }))

router.get(
  '/getAllUser',
  rolePermissionCheck(['superadmin'], []),
  user.getalluser,
)
router.post('/changepassword', user.changepassword)

router.get(
  '/updateUserStatus',
  rolePermissionCheck(['superadmin', 'admin'], []),
  user.updateUserStatus,
)

router.get('/userDetails/:userId', user.getUserDetails)
router.post('/update/:userId', user.updateUser)

module.exports = router
