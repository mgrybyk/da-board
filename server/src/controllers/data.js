'use strict'

const Results = require('./../models/Results')
const Build = require('./../models/Build')
const Dashboard = require('./../models/Dashboard')
const Configs = require('./../models/Configs')
const request = require('request')

// Results

exports.getResults = (req, res, next) => {
  Results.getPeriodResults(req.params.period).lean().exec((err, results) => {
    if (err) return next(err, req, res, next)
    return res.send(results)
  })
}

// Build

exports.updateBuild = (req, res, next) => {
  if (!req.body) return next(req, res, next)
  console.log('updateBuild', req.body)
  Build.getBuild((err, result) => {
    if (err) return next(err, req, res, next)
    if (!result) result = new Build()
    if (req.body.buildNumber) result.number = req.body.buildNumber
    if (req.body.package) result.package = req.body.package
    result.save(err => {
      if (err) return next(err, req, res, next)
      $store.dispatch('updateBuild', result.toObject())
      $store.dispatch('checkValidity')
      return res.send()
    })
  })
}

// Dashboard

exports.updateTestStatus = (req, res, next) => {
  console.log('updateTestStatus', req.body)
  if (!req.body || !req.body.name) return next(req, res, next)
  Dashboard.getOne(req.body.name, (err, result) => {
    if (err) return next(err, req, res, next)
    if (!result) {
      result = new Dashboard()
      result.name = req.body.name
    }
    if (!result.toObject().test) {
      result.test = {}
    }
    if (req.body.type === 'ui') {
      result.test.uiState = req.body.status
      result.markModified('test.uiState')
    } else if (req.body.type === 'rest') {
      result.test.restState = req.body.status
      result.markModified('test.restState')
    } else {
      return next({ message: 'unknown test type passed' }, req, res, next)
    }
    result.save(err => {
      if (err) return next(err, req, res, next)
      $store.dispatch('updateDashboardItem', result.toObject())
      return res.send()
    })
  })
}

exports.setProcessRunning = (req, res, next) => {
  console.log('setProcessRunning', req.body)
  if (!req.body || !req.body.name) return next(req, res, next)
  Dashboard.getOne(req.body.name, (err, result) => {
    if (err) return next(err, req, res, next)
    if (!result) {
      result = new Dashboard()
      result.name = req.body.name
    }
    result.package = req.body.package
    result.isRunning = true
    result.startTime = new Date().getTime()
    result.isCancelled = false
    result.isFailure = undefined
    result.test = {}
    if ($store.getters.build.package) {
      result.isValid = $store.getters.build.package === result.package
    } else result.isValid = true
    result.save(err => {
      if (err) return next(err, req, res, next)
      $store.dispatch('updateDashboardItem', result.toObject())
      return res.send()
    })
  })
}

function setProcessEnded (req, res, next) {
  console.log('setProcessEnded', req.body)
  if (!req.body || !req.body.name) return next(req, res, next)
  Dashboard.getOne(req.body.name, (err, result) => {
    if (err) return next(err, req, res, next)
    if (!result) {
      result = new Dashboard()
      result.name = req.body.name
    }
    if (!result.toObject().test) {
      result.test = {}
    }
    result.isRunning = false
    if (req.body.isCancelled) { // temporary consider cancelled build as not valid
      result.isCancelled = true
      result.isValid = false
    } else {
      result.isFailure = req.body.isFailure
      if (result.isFailure === false && result.startTime) {
        let duration = new Date().getTime() - result.startTime
        if ($store.getters.configs[result.name] && $store.getters.configs[result.name].duration) {
          duration = 0.5 * (duration + $store.getters.configs[result.name].duration)
        }
        Configs.getOne(result.name, (err, config) => {
          if (err || !req.body) return next(err, req, res, next)
          config.duration = Math.round(duration)
          config.save(err => {
            if (err) return next(err, req, res, next)
            $store.dispatch('updateConfig', config.toObject())
            return res.send()
          })
        })
      }
    }
    if (result.test.uiState === $store.getters.testStatuses.RUNNING) {
      result.test.uiState = undefined
      result.markModified('test.uiState')
    } else if (result.test.uiState === $store.getters.testStatuses.RUNNING) {
      result.test.restState = undefined
      result.markModified('test.restState')
    }
    result.save(err => {
      if (err) return next(err, req, res, next)
      $store.dispatch('updateDashboardItem', result.toObject())
      return res.send()
    })
  })
}
exports.setProcessEnded = setProcessEnded

exports.daProcessEnded = (req, res, next) => {
  console.log('daProcessEnded', req.body.status)
  request.get(`${req.body.externalData.url}/${req.body.id}/${req.body.externalData.method}`, {
    'auth': {
      'user': req.body.externalData.user,
      'pass': req.body.externalData.pass
    }
  }, (error, response, body) => {
    if (error) return next(error, req, res, next)
    let entry = null
    try {
      let properties = JSON.parse(body)
      entry = properties.find(x => x.name === 'test_processName')
    } catch (err) {
      return next(err, req, res, next)
    }
    if (!entry || !entry.value) {
      return next({ message: 'test_processName not found' }, req, res, next)
    }
    let status = req.body.status
    req.body = {}
    req.body.name = entry.value
    if (status === 'FAILED') {
      req.body.isFailure = true
    } else if (status === 'SUCCESS') {
      req.body.isFailure = false
    } else {
      req.body.isCancelled = true
    }
    setProcessEnded(req, res, next)
  })
}
