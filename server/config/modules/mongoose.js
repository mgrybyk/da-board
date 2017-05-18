'use strict'

var mongoose = require('mongoose')
mongoose.Promise = global.Promise

const mongooseOpts = {
  server: {
    reconnectInterval: 12000,
    reconnectTries: 300
  }
}
function connectWithRetry () {
  mongoose.connect('mongodb://localhost/daBoard', mongooseOpts).catch(err => {
    console.error('Failed to connect to mongo on first connect, retrying in 10 sec')
    setTimeout(connectWithRetry, 10000)
  })
}
connectWithRetry()

var db = mongoose.connection

db.once('open', () => log.info('Connection to mongoDb established.'))
db.on('error', () => log.error('Connection to mongoDb error'))
db.on('reconnected', () => log.info('MongoDB reconnected!'))
db.on('disconnected', () => log.warn('MongoDB disconnected!'))

module.exports = db
