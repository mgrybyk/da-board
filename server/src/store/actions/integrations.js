const Integrations = require('../../models/Integrations')

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
  }
}

module.exports = actions
