const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const passport = require('passport')
const db = require('../models')
const User = db.User
const Role = db.Role
const Permission = db.Permission

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = '12345'

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // Find the user by email_id from the JWT payload
      const user = await User.findOne({
        where: { emailId: jwt_payload.emailId },
        include: [
          {
            model: Role,
            as: 'roles',
            through: { attributes: [] },
            attributes: ['name'],
          },
          {
            model: Permission,
            as: 'permissions',
            through: { attributes: [] },
            attributes: ['name'],
          },
        ],
      })

      if (user) {
        // If user found, return it
        return done(null, user)
      } else {
        // If user not found, return false
        return done(null, false)
      }
    } catch (error) {
      // If an error occurs, return the error
      return done(error, false)
    }
  }),
)

module.exports = passport
