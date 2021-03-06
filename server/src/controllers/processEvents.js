'use strict'

const Tiles = require('./../models/Tiles')
const formatStr = require('../utils')

exports.updateStageStatus = (req, res, next) => {
  log.verbose('updateStageStatus', req.body)

  if (!req.body || !req.body.name) return next(req, res, next)

  Tiles.getOne(req.body.name, (err, result) => {
    if (err) return next(err, req, res, next)

    if (!result) {
      result = new Tiles()
      result.name = req.body.name
    }

    if (!result.toObject().stages) { result.stages = {} }

    result.stages[req.body.stage] = req.body.status
    result.markModified(`stages.${req.body.stage}`)
    result.timestamp = new Date().getTime()

    result.save((err, savedDoc) => {
      if (err) return next(err, req, res, next)

      $store.dispatch('updateTile', savedDoc.toObject())
      return res.send()
    })
  })
}

exports.setProcessRunning = (req, res, next) => {
  log.verbose('setProcessRunning', req.body)

  if (!req.body || !req.body.name) return next(req, res, next)

  Tiles.getOne(req.body.name, (err, result) => {
    if (err) return next(err, req, res, next)

    if (!result) {
      result = new Tiles()
      result.name = req.body.name

      $store.dispatch('createEmptyConfig', { name: req.body.name })
    }

    result.package = req.body.package
    result.isRunning = true
    result.startTime = new Date().getTime()
    result.isCancelled = false
    result.isFailure = undefined
    result.userFlag = undefined
    result.stages = {}
    result.processId = req.body.processId
    result.timestamp = new Date().getTime()
    let config = $store.getters.configs[req.body.name]
    if (req.body.processId && config && config.integration) {
      let integration = $store.getters.integrations[config.integration.name]
      result.processUrl = formatStr(integration.processUrlTemplate,
        Object.assign({}, { rootUrl: integration.rootUrl }, config.integration.props, { processId: req.body.processId }))
    } else { result.processUrl = undefined }

    result.save((err, savedDoc) => {
      if (err) return next(err, req, res, next)

      $store.dispatch('updateTile', savedDoc.toObject())
      return res.send()
    })
  })
}

exports.setEnvPackage = (req, res, next) => {
  log.verbose('setEnvPackage', req.body)

  if (!req.body || !req.body.name) return next(req, res, next)

  Tiles.getOne(req.body.name, (err, result) => {
    if (err) return next(err, req, res, next)

    if (!result) {
      result = new Tiles()
      result.name = req.body.name

      $store.dispatch('createEmptyConfig', { name: req.body.name })
    }

    result.package = req.body.package
    result.timestamp = new Date().getTime()

    result.save((err, savedDoc) => {
      if (err) return next(err, req, res, next)

      $store.dispatch('updateTile', savedDoc.toObject())
      return res.send()
    })
  })
}

// function setProcessEnded (req, res, next) {
exports.setProcessEnded = (req, res, next) => {
  log.verbose('setProcessEnded', req.body)

  if (!req.body || !req.body.name) return next(req, res, next)

  Tiles.getOne(req.body.name, (err, result) => {
    if (err) return next(err, req, res, next)

    if (!result) {
      result = new Tiles()
      result.name = req.body.name

      $store.dispatch('createEmptyConfig', { name: req.body.name })
    }

    if (!result.toObject().stages) { result.stages = {} }

    result.isRunning = false
    result.timestamp = new Date().getTime()

    if (req.body.isCancelled) {
      result.isCancelled = true
    } else {
      result.isFailure = req.body.isFailure
      updateDuration(result, req, res, next)
    }

    Object.keys(result.stages).forEach(stage => {
      if (result.stages[stage] === $store.getters.executionStatuses.RUNNING.name) {
        result.stages[stage] = null
        result.markModified(`stages.${stage}`)
      }
    })

    result.save((err, savedDoc) => {
      if (err) return next(err, req, res, next)

      $store.dispatch('updateTile', result.toObject())
      return res.send()
    })
  })
}

function updateDuration (tile, req, res, next) {
  if (tile.isFailure === false && tile.startTime) {
    let duration = new Date().getTime() - tile.startTime

    if ($store.getters.configs[tile.name] && $store.getters.configs[tile.name].duration) {
      duration = 0.25 * (3 * duration + $store.getters.configs[tile.name].duration)
    }

    $store.dispatch('updateConfigDb', { name: tile.name, duration: Math.round(duration) })
  }
}
