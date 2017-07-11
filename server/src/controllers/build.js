'use strict'

const Builds = require('./../models/Builds')

exports.updateBuild = (req, res, next) => {
  if (!req.body) return next(req, res, next)

  log.verbose('updateBuild', req.body)

  let integration = req.body.integration ? req.body.integration : 'no-integration-provided'
  Builds.getOne(integration, (err, build) => {
    if (err) return next(err, req, res, next)

    if (!build) build = new Builds()
    if (req.body.buildNumber) build.number = req.body.buildNumber
    if (req.body.package) {
      if (req.body.package === build.package) return res.send()
      build.package = req.body.package
    }
    build.integration = integration
    build.timestamp = new Date().getTime()

    build.save((err, savedDoc) => {
      if (err) return next(err, req, res, next)

      // update build number in store and notify clients
      $store.dispatch('updateBuild', savedDoc.toObject())

      return res.send()
    })
  })
}
