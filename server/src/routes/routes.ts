import { Router } from 'express'
import { buildRoute } from './build-routes.js'
import { authRoute } from './auth-routes.js'

export const routes = Router()

routes.use('/api', authRoute)
routes.use('/api', buildRoute)
