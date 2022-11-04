import * as health from '@cloudnative/health-connect'

const healthCheck = new health.HealthChecker()

const stub = new health.ReadinessCheck('app readiness', async () => {
  // nothing here for our app
})

healthCheck.registerReadinessCheck(stub)

export const LivenessEndpoint = health.LivenessEndpoint(healthCheck)
export const ReadinessEndpoint = health.ReadinessEndpoint(healthCheck)
export const HealthEndpoint = health.HealthEndpoint(healthCheck)
