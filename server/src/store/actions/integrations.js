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

    // log.trace(url, body, action.method)

    // todo: specify headers in db, do not hardcode here
    let requestParams = { url: url, method: action.method, headers: { 'content-type': 'application/json' } }
    if (integration.auth) {
      requestParams.auth = integration.auth
    }
    if (body) {
      requestParams.body = body
    }

    request(requestParams, (error, response, body) => {
      let socketData = {
        actionName: data.action,
        configName: data.configName
      }
      if (error) {
        log.error(error)
        socketData.isError = !!error || response.statusCode < 200 || response.statusCode > 399
        socketData.error = error.message || error
      } else {
        socketData.isError = response.statusCode < 200 || response.statusCode > 399
        if (socketData.isError) {
          socketData.error = `Code: ${response.statusCode}; body: ${body.substr(0, 280)}${body.length > 280 ? '...' : ''}`
        }
      }

      data['__socket'].emit('SOCKET_INTEGRATION_ACTION_RESULT', socketData)
    })
  },

  updateIntegrationDb ({ state, commit, dispatch }, data) {
    let condition = {}
    if (data._id) {
      condition._id = data._id
    } else {
      condition.name = data.name
    }
    Integrations.getOneBy(condition, (err, integration) => {
      if (err) {
        log.error(err)
        return dispatch('notifyDialogErr', Object.assign({}, data, { err }))
      }

      let prevName
      if (!integration) {
        integration = new Integrations(data)
      } else {
        if (integration.name !== data.name) {
          prevName = integration.name
        }
        Object.keys(data).forEach(key => {
          if (!key.startsWith('_') && (integration[key] !== data[key])) {
            integration[key] = data[key]
            integration.markModified(key)
          }
        })
      }
      integration.timestamp = new Date().getTime()

      integration.save(err => {
        if (err) {
          log.error(err)
          return dispatch('notifyDialogErr', Object.assign({}, data, { err }))
        }

        dispatch('notifyDialogOk', data)
        $store.dispatch('updateIntegration', Object.assign({}, integration.toObject(), { prevName }))
        if (prevName) {
          commit('deleteIntegration', prevName)
        }
      })
    })
  },

  removeIntegrationDb ({ state, commit, dispatch }, data) {
    Integrations.removeOne(data.name, (err, doc) => {
      if (err || !doc) {
        log.error(err)
        return dispatch('notifyDeleteErr', Object.assign({}, data, { err }))
      }
      dispatch('notifyDeleteOk', data)

      commit('deleteIntegration', data.name)

      io.emit('SOCKET_INTEGRATIONS_DELETE', { name: data.name })
    })
  }
}

module.exports = actions
