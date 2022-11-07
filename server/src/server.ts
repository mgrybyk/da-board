import { app } from './app.js'
import config from './config/config.js'
import { connectToDbWithRetry } from './config/mongodb.js'

connectToDbWithRetry()

const server = app
  .listen(config.serverPort, config.serverHost, () => {
    console.info(`Listening to port ${config.serverHost}:${config.serverPort}`)
  })
  .once('error', (e: Error & { code?: string }) => {
    if (e.code === 'EADDRINUSE') {
      console.error(e)
      process.exit()
    }
    throw e
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
