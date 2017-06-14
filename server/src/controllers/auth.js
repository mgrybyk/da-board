'use strict'

const passport = require('passport')
const User = require('./../models/User')

function login (req, res, next) {
  var responseData = { success: false }
  if (req.isAuthenticated()) {
    responseData.message = 'You are already logged in.'
    return res.send(responseData)
  }

  if (req.body.username.length < 2 || req.body.password.length < 2) {
    responseData.message = 'Login and password length should be 3 symbols or more.'
    return res.send(responseData)
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      responseData.message = info || 'authentication failed'
      return res.send(responseData)
    }
    req.logIn(user, (err) => {
      if (err) {
        responseData.message = err || 'authentication failed'
        return res.send(responseData)
      }
      responseData = {
        success: true,
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName
        }
      }
      return res.send(responseData)
    })
  })(req, res, next)
}

exports.login = login

exports.signup = (req, res, next) => {
  var responseData = { success: false }
  if (req.isAuthenticated()) {
    responseData.message = 'You are already logged in.'
    return res.send(responseData)
  }

  if ($store.getters.settings['signup_allowed'].flag !== true) {
    responseData.message = 'Signup not allowed. Please contact any existing user to allow it.'
    return res.send(responseData)
  }

  if (req.body.username.length < 2 || req.body.password.length < 2) {
    responseData.message = 'Login and password length should be 3 symbols or more.'
    return res.send(responseData)
  }

  if (!req.body.displayName) {
    req.body.displayName = req.body.username
  }

  User.saveUser(req.body, (err, result) => {
    if (err) {
      log.error(err)
      responseData.message = result || 'Signup failed.'
      return res.send(responseData)
    }
    return login(req, res, next)
  })
}

exports.logout = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout()
  }
  res.send({ success: true })
}

exports.me = (req, res, next) => {
  var responseData = { success: false }

  if (!req.isAuthenticated()) {
    responseData.message = 'Please login first.'
    return res.send(responseData)
  }

  responseData = {
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      displayName: req.user.displayName
    }
  }
  res.send(responseData)
}
