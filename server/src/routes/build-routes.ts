import { Router } from 'express'
import Joi from 'joi'
import { buildActions } from '../controllers/build.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const buildRoute = Router()

const buildchema = Joi.object<{ buildNumber?: string; package?: string; integration: string }>({
  buildNumber: Joi.string().optional(),
  package: Joi.string().optional(),
  integration: Joi.string().default('no-integration-provided'),
}).or('buildNumber', 'package')

buildRoute.post(
  '/build',
  asyncHandler(async (req, res) => {
    console.debug('updateBuild', req.body)

    const { value, error } = buildchema.validate(req.body)
    if (error) {
      throw error
    }

    await buildActions.createOrUpdate(value)

    res.send()
  })
)
