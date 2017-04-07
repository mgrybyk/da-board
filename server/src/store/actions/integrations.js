const Integrations = require('../../models/Integrations')
const formatStr = require('../../utils')
const request = require('request')

const actions = {
  async setIntegrations({ commit, dispatch }) {
    return Integrations.getAll((err, results) => {
      if (err) return log.error(err)

      results.forEach(val => commit('updateIntegration', val.toObject()))
    })
  },

  updateIntegration({ state, commit, dispatch }, item) {
    commit('updateIntegration', item)
    io.emit('SOCKET_INTEGRATIONS_UPDATE_ONE', state.integrations[item.name])
  },

  integrationAction({ state }, data) {
    let processId = ''
    if (state.tiles[data.configName] && state.tiles[data.configName].processId) {
      processId = state.tiles[data.configName].processId
    }
    let config = state.configs[data.configName]
    let configIntegration = config.integration
    let integration = state.integrations[configIntegration.name]
    let action = integration.actions[data.action]
    let props = Object.assign({}, { 'hostname': config.hostname }, { 'name': config.name }, { rootUrl: integration.rootUrl },
      configIntegration.props, { processId })

    let url = formatStr(action.urlTemplate, props)
    let body = formatStr(action.body, props)

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
      if (error) log.error(error)
      console.log('SOCKET_INTEGRATION_ACTION_RESULT')
      io.emit('SOCKET_INTEGRATION_ACTION_RESULT', {
        actionName: data.action,
        configName: data.configName,
        isError: !!error || response.statusCode < 200 || response.statusCode > 399,
        error: error || `Code: ${response.statusCode}; body: ${body.substr(0, 280)}${body.length > 280 && '...'}`
      })
      console.log(response.statusCode, body)
    })
  }
}

module.exports = actions
