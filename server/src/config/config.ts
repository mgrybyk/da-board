import { config } from 'dotenv'
config()

import Joi from 'joi'

const envVarsSchema = Joi.object()
  .keys({
    SERVER_HOST: Joi.string().default('127.0.0.1'),
    PORT: Joi.number().default(8230),
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default {
  port: envVars.PORT,
  serverHost: envVars.SERVER_HOST,
}
