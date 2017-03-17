'use strict'

const Build = require('./../models/Build')

exports.updateBuild = (req, res, next) => {
  if (!req.body) return next(req, res, next)

  log.verbose('updateBuild', req.body)

  Build.getBuild((err, build) => {
    if (err) return next(err, req, res, next)

    if (!build) build = new Build()
    if (req.body.buildNumber) build.number = req.body.buildNumber
    if (req.body.package) build.package = req.body.package

    build.save(err => {
      if (err) return next(err, req, res, next)

      // update build number in store and notify clients
      $store.dispatch('updateBuild', build.toObject())

      // dashboard charts become grey on new build
      $store.dispatch('checkValidity')

      return res.send()
    })
  })
}
