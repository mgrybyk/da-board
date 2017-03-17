const Integrations = require('../../models/Integrations')
const formatStr = require('../../utils')
const request = require('request')

const actions = {
  async setIntegrations ({ commit, dispatch }) {
    return Integrations.getAll((err, results) => {
      if (err) return log.error(err)

      results.forEach(val => commit('updateIntegration', val.toObject()))
    })
  },

  updateIntegration ({ state, commit, dispatch }, item) {
    commit('updateIntegration', item)
    io.emit('SOCKET_INTEGRATIONS_UPDATE_ONE', state.integrations[item.name])
  },

  integrationAction ({ state }, data) {
    let configIntegration = state.configs[data.configName].integration
    let integration = state.integrations[configIntegration.name]
    let action = integration.actions[data.action]
    let props = configIntegration.props

    let url = formatStr(action.urlTemplate, Object.assign({}, { rootUrl: integration.rootUrl }, props))
    let body = formatStr(action.body, Object.assign({}, { rootUrl: integration.rootUrl }, props))

    console.log(url, body, action.method, integration.auth)

    // todo: specify headers in db, do not hardcode here
    let requestParams = { url: url, method: action.method, headers: { 'content-type': 'application/json' } }
    if (integration.auth) {
      requestParams.auth = integration.auth
    }
    if (body) {
      requestParams.body = body
    }

    request(requestParams, (error, response, body) => {
      if (error) return log.error(error)
      console.log(response.statusCode, body)
    })
  }
}

module.exports = actions
