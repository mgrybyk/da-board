'use strict'

const path = require('path')
const fs = require('fs')
const express = require('express')
const webpack = require('webpack')
const opn = require('opn')
const config = require('../config')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

const hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', compilation => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(context => {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./assets'))

app.get('/1', (req, res, next) => {
  fs.readFile('build/mocks/results.js', (err, data) => {
      res.send(JSON.parse(data.toString('utf8')))
  })
})


var http = require('http').Server(app);
var io = require('socket.io')(http);

let restTests = [0, 0, 0, 0]
let uiTests = [0, 0, 0, 0]
let installerTests = [0, 0, 0, 0]

const stateNames = {
  failed: 'failed',
  running: 'running',
  passed: 'passed'
}

const stateIdx = {
  'failed': 0,
  'running': 1,
  'passed': 2,
  'Not_executed': 3
}

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('GET_CHART_INSTALLER', (data) => {
    console.log('GET_CHART_INSTALLER')
    installerTests = [0, 0, 0, 0]
    fs.readFile('build/mocks/dashboard.js', (err, data) => { 
      let dataJson = JSON.parse(data.toString('utf8'))
      dataJson.forEach(val => {
        if (!val.isValid) {
          installerTests[stateIdx.Not_executed]++
          restTests[stateIdx.Not_executed]++
          if (val.env.browser) {
            uiTests[stateIdx.Not_executed]++
          }
        } else if (val.isRunning) {
          installerTests[stateIdx.running]++
          if (val.test.restState === stateNames.running) {
            restTests[stateIdx.running]++
          } else if (val.test.uiState === stateNames.running) {
            uiTests[stateIdx.running]++
          }
        } else {
          val.isFailure ? installerTests[stateIdx.failed]++ : installerTests[stateIdx.passed]++
          (val.test.restState === stateNames.passed) ? restTests[stateIdx.passed]++ : restTests[stateIdx.failed]++
          (val.test.uiState === stateNames.passed) ? uiTests[stateIdx.passed]++ : uiTests[stateIdx.failed]++
        }
      })

      socket.emit('SOCKET_CHART_INSTALLER', installerTests)
    })
  })

  socket.on('GET_CHART_UI', (data) => {
    console.log('GET_CHART_UI')
    uiTests = [0, 0, 0, 0]
    fs.readFile('build/mocks/dashboard.js', (err, data) => {
      let dataJson = JSON.parse(data.toString('utf8'))
      dataJson.forEach(val => {
        if (!val.isValid) {
          installerTests[stateIdx.Not_executed]++
          restTests[stateIdx.Not_executed]++
          if (val.env.browser) {
            uiTests[stateIdx.Not_executed]++
          }
        } else if (val.isRunning) {
          installerTests[stateIdx.running]++
          if (val.test.restState === stateNames.running) {
            restTests[stateIdx.running]++
          } else if (val.test.uiState === stateNames.running) {
            uiTests[stateIdx.running]++
          }
        } else {
          val.isFailure ? installerTests[stateIdx.failed]++ : installerTests[stateIdx.passed]++
          (val.test.restState === stateNames.passed) ? restTests[stateIdx.passed]++ : restTests[stateIdx.failed]++
          if (val.env.browser) {
            (val.test.uiState === stateNames.passed) ? uiTests[stateIdx.passed]++ : uiTests[stateIdx.failed]++
          }
        }
      })

      socket.emit('SOCKET_CHART_UI', uiTests)
    })
  })

  socket.on('GET_CHART_REST', (data) => {
    console.log('GET_CHART_REST')

    socket.emit('SOCKET_CHART_REST', [0, 0, 0, 14])
    setTimeout(() => { socket.emit('SOCKET_CHART_REST', [0, 1, 0, 13]) }, 3000)
    setTimeout(() => { socket.emit('SOCKET_CHART_REST', [0, 2, 0, 12]) }, 4000)
    setTimeout(() => { socket.emit('SOCKET_CHART_REST', [0, 5, 0, 9]) }, 5000)
    setTimeout(() => { socket.emit('SOCKET_CHART_REST', [1, 4, 3, 6]) }, 6000)
    setTimeout(() => { socket.emit('SOCKET_CHART_REST', [1, 3, 6, 4]) }, 7000)
    setTimeout(() => { socket.emit('SOCKET_CHART_REST', [1, 2, 9, 2]) }, 8000)
    setTimeout(() => { socket.emit('SOCKET_CHART_REST', [2, 1, 10, 1]) }, 9000)
    setTimeout(() => { socket.emit('SOCKET_CHART_REST', [2, 1, 11, 0]) }, 10000)
    setTimeout(() => { socket.emit('SOCKET_CHART_REST', [2, 0, 12, 0]) }, 11000)

/*    restTests = [0, 0, 0, 0]
    fs.readFile('build/mocks/dashboard.js', (err, data) => {
      let dataJson = JSON.parse(data.toString('utf8'))
      dataJson.forEach(val => {
        if (!val.isValid) {
          installerTests[stateIdx.Not_executed]++
          restTests[stateIdx.Not_executed]++
          if (val.env.browser) {
            uiTests[stateIdx.Not_executed]++
          }
        } else if (val.isRunning) {
          installerTests[stateIdx.running]++
          if (val.test.restState === stateNames.running) {
            restTests[stateIdx.running]++
          } else if (val.test.uiState === stateNames.running) {
            uiTests[stateIdx.running]++
          }
        } else {
          val.isFailure ? installerTests[stateIdx.failed]++ : installerTests[stateIdx.passed]++
          (val.test.restState === stateNames.passed) ? restTests[stateIdx.passed]++ : restTests[stateIdx.failed]++
          if (val.env.browser) {
            (val.test.uiState === stateNames.passed) ? uiTests[stateIdx.passed]++ : uiTests[stateIdx.failed]++
          }
        }
      })
    })
*/
  })


// NOTE: handle case is tests hanged in running state while the process failed/terminated abnormally
/*
        if (!val.isRunning) {
          if (val.test.restState === stateNames.running) {
            restTests[stateIdx.running]++
          } else if (val.test.uiState === stateNames.running) {
            uiTests[stateIdx.running]++
          }
        }
*/


  socket.on('GET_DASHBOARD', (data) => {
    console.log('GET_DASHBOARD')
    fs.readFile('build/mocks/dashboard.js', (err, data) => {
      let jsonData = JSON.parse(data.toString('utf8'))
      socket.emit('SOCKET_DASHBOARD', jsonData)
      jsonData[0].isFailure = true
      setTimeout(() => { socket.emit('SOCKET_DASHBOARD', jsonData) }, 5000)
    })
  })
});

http.listen(port, err => {
  if (err) {
    console.log(err)
    return
  }
  const uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')
  opn(uri)
})


module.exports = http
