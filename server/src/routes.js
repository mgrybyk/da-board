'use strict'

var html = require('./controllers/html')
const results = require('./controllers/results')
const build = require('./controllers/build')
const processEvents = require('./controllers/processEvents')
const auth = require('./controllers/auth')
const integrationsDa = require('./controllers/integrations/da')

exports.routes = app => {
  // index html
  app.get('/', html.appHtml)

  // static (allure)
  app.get('/results/:timestamp', html.helper)
  app.get('/results', html.helper)
  app.get('/results/', html.helper)
  app.get('/results/:timestamp/*', html.site)

  // results
  app.get('/api/results/:period', results.getResults)

  // build
  app.post('/api/build', build.updateBuild) // package, number

  // api
  app.post('/api/tests', processEvents.updateTestStatus) // type, state (running, failed, passed), processName
  app.post('/api/processRunning', processEvents.setProcessRunning) // processName, package
  app.post('/api/processEnded', processEvents.setProcessEnded) // processName, status

  // integrations
  app.post('/api/da-subscription', integrationsDa.daProcessEnded) // parse and redirect to processEnded

  // auth
  app.post('/api/signin', auth.login)
  app.post('/api/signup', auth.signup)
  app.post('/api/logout', auth.logout)
  app.get('/api/me', auth.me)
}
