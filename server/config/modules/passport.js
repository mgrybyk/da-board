'use strict'

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
const crypto = require('crypto')

module.exports = User => {
  passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false, 'Incorrect username.')
      }
      if (password !== decryptPassword(user.password)) {
        return done(null, false, 'Incorrect password.')
      }
      return done(null, user)
    })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}

function decryptPassword (pwd) {
  let decipher = crypto.createDecipher(CONFIG.algorithm, CONFIG.key)
  return decipher.update(pwd, 'hex', 'utf8') + decipher.final('utf8')
}
