// there is no way to send notification from DA once process completed at the moment
// so I have to make an additional request to DA

// NOTE: custom request property is used to obtain parent process name
// so if you want to use current process name as process name
// you have to store it in custom property.

'use strict'

const formatUrl = require('../../utils')
const processEvents = require('../processEvents')
const request = require('request')

// request from DA

// code will be rewritten once deployment requests are ready.
// Hopefully it will be removed.
exports.daProcessEnded = (req, res, next) => {
  log.verbose('daProcessEnded', req.body.result)

  if (!req.body.externalData || !req.body.externalData.name || !req.body.externalData.propName) {
    log.trace(req.body)
    return next({ message: 'badly configured DA integration.' }, req, res, next)
  }

  let da = $store.getters.integrations[req.body.externalData.name]
  if (!da) {
    return next({ message: 'unknwon DA integration name provided.' }, req, res, next)
  }

  // make request to DA to get request properties
  request.get(formatUrl(da.remote.getProperties.urlTemplate, { rootUrl: da.rootUrl, requestId: req.body.id }), {
    'auth': da.auth
  }, (error, response, body) => {
    if (error) return next(error, req, res, next)

    // get process name from request properties
    let processName = getProcessName(body, req.body.externalData.propName, req, res, next)
    if (!processName || !processName.value) {
      return next({ message: `${req.body.externalData.propName} not found` }, req, res, next)
    }

    // build request body for "dashboard.processEnded"
    req.body = buildReqBody(req.body.result, processName.value)
    processEvents.setProcessEnded(req, res, next)
  })
}

/* === helpers === */

function getProcessName (body, propName, req, res, next) {
  try {
    let properties = JSON.parse(body)
    return properties.records.find(x => x.name === propName)
  } catch (err) {
    return next(err, req, res, next)
  }
}

function buildReqBody (result, processName) {
  let body = {}

  body.name = processName
  if (result === 'FAULTED') {
    body.isFailure = true
  } else if (result === 'SUCCEEDED') {
    body.isFailure = false
  } else {
    body.isCancelled = true
  }

  return body
}
