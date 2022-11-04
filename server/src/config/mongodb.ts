import mongoose from 'mongoose'
import config from './config.js'

let isDbConnected = false

export const dbIsConnected = () => isDbConnected

export const dbConnectionPromise = new Promise<void>((resolve) => mongoose.connection.once('open', resolve))

mongoose.connection.on('open', () => {
  isDbConnected = true
  console.log('Connection to mongoDb established.')
})
mongoose.connection.on('error', () => console.error('Connection to mongoDb error'))
mongoose.connection.on('reconnected', () => {
  isDbConnected = true
  console.info('MongoDB reconnected!')
})
mongoose.connection.on('disconnected', () => {
  isDbConnected = false
  console.warn('Failed to connect to mongo, retrying in 10 sec')
  setTimeout(connectWithRetry, 10000)
})

const connectWithRetry = () => {
  mongoose.connect(config.mongooseUrl).catch(() => {})
}

connectWithRetry()
