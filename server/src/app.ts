import express from 'express'
import { HealthEndpoint, LivenessEndpoint, ReadinessEndpoint } from './middlewares/health.js'

// import { routes } from './routes/v1/index'
import { ApiError } from './error/error.js'
import { errorConverter, errorHandler } from './middlewares/error.js'

export const app = express()

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

app.use('/health/liveness', LivenessEndpoint)
app.use('/health/readiness', ReadinessEndpoint)
app.use('/health', HealthEndpoint)

// v1 api routes
// app.use('/v1', routes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, 'Not found'))
})

// convert error to ApiError, if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)
