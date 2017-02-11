'use strict'

var html = require('./controllers/html')
var data = require('./controllers/data')

exports.routes = app => {
  // index html
  app.get('/', html.appHtml)

  // results
  app.get('/api/results/:period', data.getResults)

  // static (allure)
  app.get('/results/:timestamp', html.helper)
  app.get('/results', html.helper)
  app.get('/results/', html.helper)
  app.get('/results/:timestamp/*', html.site)

  // remote api
  app.post('/api/tests', data.updateTestStatus) // type, state (running, failed, passed), processName

  app.post('/api/build', data.updateBuild) // package, number

  app.post('/api/processRunning', data.setProcessRunning) // processName, package
  app.post('/api/processEnded', data.setProcessEnded) // processName, status
  app.post('/api/da-subscription', data.daProcessEnded) // parse and redirect to processEnded
}
