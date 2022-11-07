import express from 'express'

import { HealthEndpoint, LivenessEndpoint, ReadinessEndpoint } from '../middlewares/health.js'

export const app = express()

app.use('/health/liveness', LivenessEndpoint)
app.use('/health/readiness', ReadinessEndpoint)
app.use('/health', HealthEndpoint)
