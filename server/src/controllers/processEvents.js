'use strict'

const Tiles = require('./../models/Tiles')
const Configs = require('./../models/Configs')

exports.updateStageStatus = (req, res, next) => {
  log.verbose('updateStageStatus', req.body)

  if (!req.body || !req.body.name) return next(req, res, next)

  Tiles.getOne(req.body.name, (err, result) => {
    if (err) return next(err, req, res, next)

    if (!result) {
      result = new Tiles()
      result.name = req.body.name

      // $store.dispatch('addStage', { name: req.body.name, stages: [req.body.stage] })
    }

    if (!result.toObject().stages) { result.stages = {} }

    result.stages[req.body.stage] = req.body.status
    // result.markModified(`stages`)
    result.markModified(`stages.${req.body.stage}`)

    result.save(err => {
      if (err) return next(err, req, res, next)

      $store.dispatch('updateTile', result.toObject())
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
    result.stages = {}
    result.processId = req.body.processId

    if ($store.getters.build.package) {
      result.isValid = $store.getters.build.package === result.package
    } else result.isValid = true

    result.save(err => {
      if (err) return next(err, req, res, next)

      $store.dispatch('updateTile', result.toObject())
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

    result.save(err => {
      if (err) return next(err, req, res, next)

      $store.dispatch('updateTile', result.toObject())
      return res.send()
    })
  })
}
// exports.setProcessEnded = setProcessEnded

function updateDuration (tile, req, res, next) {
  if (tile.isFailure === false && tile.startTime) {
    let duration = new Date().getTime() - tile.startTime

    if ($store.getters.configs[tile.name] && $store.getters.configs[tile.name].duration) {
      duration = 0.5 * (duration + $store.getters.configs[tile.name].duration)
    }

    Configs.getOne(tile.name, (err, config) => {
      if (err || !req.body) return next(err, req, res, next)

      if (!config) {
        config = new Configs()
        config.name = tile.name
        config.type = 'GENERATED'
      }

      config.duration = Math.round(duration)
      config.save(err => {
        if (err) return next(err, req, res, next)

        $store.dispatch('updateConfig', config.toObject())
        return res.send()
      })
    })
  }
}
