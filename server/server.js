/* global __dirname */
'use strict'

// logging
global.log = require('./config/modules/winston')

// reading config file
global.CONFIG = require('./config/config')
CONFIG.rootDir = __dirname + '/'

// mongodb
require('./config/modules/mongoose')

// init store
global.$store = require('./src/store/store')

// get required data from db and put to store for further usage
async function init () {
  await $store.dispatch('setConfigs')
  await $store.dispatch('setBuild')
  await $store.dispatch('setDashboard')
  // $store.dispatch('checkValidity')
}
init()

// watch file, disabled for #hackfest
// require('./src/watcher')()

// express
var app = require('express')()

// setup express and routes
require('./config/modules/express')(app, require('./src/routes'))

const http = require('http').Server(app)

// socket.io
const io = require('socket.io')(http)
global.io = io
require('./src/socketListeners')(io)

// start server
var listener = http.listen(CONFIG.port, CONFIG.host, function () {
  log.info(`Listening - ${listener.address().host || '*'}:${listener.address().port}`)
})
