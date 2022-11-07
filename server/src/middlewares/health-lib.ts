import http from 'http'

type HealthCheckState = 'UP' | 'DOWN'
interface HealthCheckResponse {
  status?: HealthCheckState
  checks?: Array<{ name: string; state: HealthCheckState }>
}

class ReadinessCheck {
  private readonly checks: Record<string, () => boolean> = {}

  addCheck(name: string, fn: () => boolean) {
    this.checks[name] = () => {
      try {
        return fn()
      } catch (err) {
        console.error('ReadinessCheck', name, err)
        return false
      }
    }
  }

  runChecks() {
    const checks: HealthCheckResponse['checks'] = []

    for (const [name, fn] of Object.entries(this.checks)) {
      const result = fn()
      const state = result === true ? 'UP' : 'DOWN'
      checks.push({ name, state })
    }

    const statusCode = checks.some((r) => r.state === 'DOWN') ? 503 : 200
    return { checks, statusCode }
  }
}

const readinessCheck = new ReadinessCheck()

const healthCheck = (res: http.ServerResponse, { liveness = false, readiness = false } = {}) => {
  const json: HealthCheckResponse = {}
  let code = 200
  if (liveness) {
    json.status = 'UP'
  }
  if (readiness) {
    const { checks, statusCode } = readinessCheck.runChecks()
    json.checks = checks
    code = statusCode
  }
  res.writeHead(code, { 'Content-Type': 'application/json' }).end(JSON.stringify(json))
}

const healthEndpoint = ({ liveness = false, readiness = false } = {}) => {
  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    healthCheck(res, { liveness, readiness })
  }
}

export const addReadinessCheck = readinessCheck.addCheck.bind(readinessCheck)

export const LivenessEndpoint = healthEndpoint({ liveness: true })
export const ReadinessEndpoint = healthEndpoint({ readiness: true })
export const HealthEndpoint = healthEndpoint({ liveness: true, readiness: true })
