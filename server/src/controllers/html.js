'use strict'

const DEFAULT_ALLURE_VERSION = 'v1'

// index.html
exports.appHtml = (req, res, next) => {
  return res.sendFile(CONFIG.rootDir + CONFIG.appHtml)
}

// static site (allure) or specific test result
var site = (req, res, next) => {
  if (req.params.timestamp === undefined) { 
    return res.redirect('/')
  }

  return res.sendFile(buildStaticUrl(req))
}
exports.site = site

// handle some negative cases
exports.helper = (req, res, next) => {
  if (req.params.timestamp === undefined) {
    return res.redirect('/')
  } else if (req.params.allureVersion === undefined) {
    let url = req.url + (req.url.endsWith('/') ? '' : '/') + DEFAULT_ALLURE_VERSION + '/'
    return res.redirect(url)
  } else if (req.url.substr(-1) !== '/') {
    return res.redirect(req.url + '/')
  } else if (req.url.substr(-1) === '/') {
    return site(req, res, next)
  }

  log.warn('Something went wrong: ' + req.url)
  res.redirect('/')
}

/* === helpers === */

function buildStaticUrl (req) {
  var path = req.url.split(req.params.timestamp + '/' + req.params.allureVersion)[1]
  path = path.split('?')[0]

  let uri = CONFIG.rootDir

  // specific result data
  if (CONFIG.ALLURE_DATA_FOLDERS.some(folder => path.startsWith(`/${folder}/`))) {
    uri += 'db/results/' + req.params.timestamp
  } else {
    // static site content
    uri += CONFIG.pathToApp + '/static/' + req.params.allureVersion
  }
  uri += path

  return uri
}
