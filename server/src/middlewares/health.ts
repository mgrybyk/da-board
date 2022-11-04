import { addReadinessCheck } from './health-lib.js'
import { dbIsConnected } from './../config/mongodb.js'

addReadinessCheck('db connection', dbIsConnected)

export { HealthEndpoint, LivenessEndpoint, ReadinessEndpoint } from './health-lib.js'
