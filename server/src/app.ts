import express from 'express'
import session from 'express-session'
import passport from 'passport'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import mongoSanitize from 'express-mongo-sanitize'

import { routes } from './routes/routes.js'
import { ApiError } from './error/error.js'
import { errorConverter, errorHandler } from './middlewares/error.js'
import { dbConnectionPromise } from './config/mongodb.js'
import { UserModel } from './models/User.js'
import { app } from './config/express.js'
import { io } from './config/socket.io.js'
import { setupSocketListeners } from './socketListeners.js'

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware: any) => (socket: any, next: any) => middleware(socket.request, {}, next)

// wait for db
dbConnectionPromise.then(() => {
  app.use(express.static('www'))

  app.use(mongoSanitize())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  const sessionMiddleware = session({
    secret: 'somethingsecretgoeshere',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60480000000, // one hour is 3600000
    },
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
  })
  app.use(sessionMiddleware)

  const passportInstance = passport.initialize()
  const passportSession = passport.session()
  app.use(passportInstance)
  app.use(passportSession)
  passport.use(UserModel.createStrategy())
  passport.serializeUser(UserModel.serializeUser())
  passport.deserializeUser(UserModel.deserializeUser())

  // routes
  app.use(routes)

  // send back a 404 error for any unknown api request
  app.use((req, res, next) => {
    next(new ApiError(404, 'Not found'))
  })

  // convert error to ApiError, if needed
  app.use(errorConverter)

  // handle error
  app.use(errorHandler)

  // socket io
  io.use(wrap(sessionMiddleware))
  io.use(wrap(passportInstance))
  io.use(wrap(passportSession))
  setupSocketListeners(io)
})
