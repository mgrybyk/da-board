import { app } from './app.js'
import config from './config/config.js'

const server = app.listen(config.port, config.serverHost, () => {
  console.info(`Listening to port ${config.serverHost}:${config.port}`)
})

const unexpectedErrorHandler = (error: Error) => {
  console.error(error)
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  console.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
