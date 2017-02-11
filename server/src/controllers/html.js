'use strict'

exports.appHtml = function (req, res, next) {
  return res.sendFile(CONFIG.rootDir + CONFIG.appHtml)
}

var site = function (req, res, next) {
  if (req.params.timestamp === undefined) {
    res.redirect('/')
  }
  var path = req.url.split(req.params.timestamp)[1]
  path = path.split('?')[0]
  var uri
  if (path.indexOf('/data') === 0) {
    uri = CONFIG.rootDir + 'db/results/' + req.params.timestamp + path
  } else {
    uri = CONFIG.rootDir + CONFIG.pathToApp + '/static' + path
  }
  return res.sendFile(uri)
}
exports.site = site

exports.helper = function (req, res, next) {
  if (req.params.timestamp === undefined) {
    return res.redirect('/')
  } else if (req.url.substr(-1) !== '/') {
    return res.redirect(req.url + '/')
  } else if (req.url.substr(-1) === '/') {
    return site(req, res, next)
  }
  log.warn('Something went wrong: ' + req.url)
  res.redirect('/')
}
