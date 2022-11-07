import { Router } from 'express'

import { authRoute } from './auth-routes.js'

export const routes = Router()

routes.use('/api', authRoute)
