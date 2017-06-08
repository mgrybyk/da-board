/* global __dirname */
'use strict'

// logging
global.log = require('./config/modules/winston')

// reading config file
global.CONFIG = require('./config/config')
CONFIG.rootDir = __dirname + '/'

// mongodb
const mongooseConnection = require('./config/modules/mongoose')

// init store
// WARNING: store caches most db data
// so if you change some data in db manually you have to restart server
// it may changed in future by listening collection changes or something like that,
// but I have no time for it right now.
global.$store = require('./src/store/store')

// get required data from db and put to store for further usage
async function init () {
  await require('./config/prepopulate')()
  await $store.dispatch('setIntegrations')
  await $store.dispatch('setConfigs')
  await $store.dispatch('setBuilds')
  await $store.dispatch('setTiles')
  await $store.dispatch('setHomelinks')
  $store.dispatch('recalcSorting', { sortBy: Number.MAX_VALUE })
}
init()

// passport
require('./config/modules/passport')(require('./src/models/User'))

// express
var app = require('express')()

// setup express and routes
let express = require('./config/modules/express')
express(app, require('./src/routes'), mongooseConnection)

const http = require('http').Server(app)

// socket.io
const io = require('socket.io')(http)
express.passportIo(io)
io.set('transports', ['websocket', 'polling'])
global.io = io
require('./src/socketListeners')(io)

// start server
var listener = http.listen(CONFIG.port, CONFIG.host, function () {
  log.info(`Listening - ${listener.address().host || '*'}:${listener.address().port}`)
})
