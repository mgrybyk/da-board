'use strict'

var mongoose = require('mongoose')
mongoose.Promise = global.Promise

const dbHost = process.env.MONGODB_HOST || 'localhost'
const dbPort = process.env.MONGODB_PORT || '27017'
const dbName = process.env.MONGODB_NAME || 'daBoard'
const isAuth = process.env.MONGODB_AUTH === 'true'

const mongooseOpts = {
  server: {
    reconnectInterval: 12000,
    reconnectTries: 300
  }
}
if (isAuth) {
  mongooseOpts.user = process.env.MONGODB_USER || 'dba'
  mongooseOpts.pass = process.env.MONGODB_PASS || 'password'
}

function connectWithRetry () {
  mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, mongooseOpts).catch(err => {
    log.error('Failed to connect to mongo on first connect, retrying in 10 sec')
    err.message && log.error(err.message)
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
