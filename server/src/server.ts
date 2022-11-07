import { prepopulate, upgradeDb } from './config/prepopulate.js'
import { app } from './config/express.js'
import config from './config/config.js'
import { connectToDbWithRetry, dbConnectionPromise } from './config/mongodb.js'

connectToDbWithRetry()

export const server = app
  .listen(config.serverPort, config.serverHost, async () => {
    console.info(`Listening to port ${config.serverHost}:${config.serverPort}`)

    await dbConnectionPromise
    await prepopulate()
    await upgradeDb()

    await import('./app.js')
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
