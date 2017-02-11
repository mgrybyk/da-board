'use strict'

var express = require('express')
var bodyParser = require('body-parser')

module.exports = function (app, routes) {
  var pathToPublic = CONFIG.pathToApp
  // app.use(logWho);
  app.use(express.static(pathToPublic))
  app.use(bodyParser.json())
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
  log.verbose('req.body:\n%s', req.body)
  return res.send({
    error: err.message,
    code: 500
  })
}
