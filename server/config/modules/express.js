'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const MongoStore = require('connect-mongo')(session)
const fileUpload = require('express-fileupload')

module.exports = (app, routes, mongooseConnection) => {
  var userSession = {
    resave: true,
    saveUninitialized: true,
    secret: 'daBoard J:O#$Y*(#',
    cookie: {
      maxAge: 60480000000 // one hour is 3600000
    },
    store: new MongoStore({ mongooseConnection: mongooseConnection })
  }
  var pathToPublic = CONFIG.pathToApp
  // app.use(logWho);
  app.use(express.static(pathToPublic))
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(session(userSession))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(fileUpload())
  routes.routes(app)
  app.use(pageNotFound)
  app.use(internalServerError)
}

// function logWho(req, res, next) {
//   var who = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   log.verbose(who + ' req: ' + req.headers.host + req.url);
//   next();
// }

function pageNotFound (req, res, next) {
  res.status(404)
  log.warn('Not found URL: ' + req.url)
  return res.send({
    error: 'Resource not found',
    code: 404
  })
}

function internalServerError (err, req, res, next) {
  err.message = err.message || 'Unknown error'
  res.status(err.status || 500)
  log.error('Internal error(%d): %s', res.statusCode, err.message)
  log.verbose('req.body:', req.body)
  return res.send({
    error: err.message,
    code: 500
  })
}
