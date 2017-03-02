// there is no way to send notification from DA once process completed at the moment
// so I have to make an additional request to DA

// NOTE: custom request property is used to obtain parent process name
// so if you want to use current process name as process name
// you have to store it in custom property.

'use strict'

const formatUrl = require('./utils')
const request = require('request')

// request from DA

// code will be rewritten once deployment requests are ready.
// Hopefully it will be removed.
exports.daProcessEnded = (req, res, next) => {
  log.debug('daProcessEnded', req.body.status)

  if (!req.body.externalData || !req.body.externalData.name || !req.body.externalData.secret || !req.body.externalData.propName) {
    console.log(req.body)
    return next({ message: 'badly configured DA integration.' }, req, res, next)
  }

  let da = $store.getters.integrations[req.body.externalData.name]
  if (!da) {
    return next({ message: 'unknwon DA integration name provided.' }, req, res, next)
  }

  if (!da.secret === req.body.externalData.secret) {
    return next({ message: 'unknwon DA secret provided.' }, req, res, next)
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
    req.body = buildReqBody(req.body.status, processName.value)

    // trigger "dashboard.processEnded"
    res.redirect('/api/processEnded')
    // setProcessEnded(req, res, next)
  })
}

/* === helpers === */

function getProcessName (body, propName, req, res, next) {
  try {
    let properties = JSON.parse(body)
    return properties.find(x => x.name === 'test_processName')
  } catch (err) {
    return next(err, req, res, next)
  }
}

function buildReqBody (status, processName) {
  let body = {}

  body.name = processName.value
  if (status === 'FAILED') {
    body.isFailure = true
  } else if (status === 'SUCCESS') {
    body.isFailure = false
  } else {
    body.isCancelled = true
  }

  return body
}

// 'user': da.auth.user,
//         'pass': da.user.pass