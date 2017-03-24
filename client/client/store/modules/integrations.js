import * as types from '../mutation-types'

const state = {
  data: {}
}

const mutations = {
  [types.SOCKET_INTEGRATIONS] (state, data) {
    state.data = data
  },

  [types.SOCKET_INTEGRATIONS_UPDATE_ONE] (state, integration) {
    let integrations = {...state.data}
    integrations[integration.name] = integration
    state.data = integrations
  }
}

export default {
  state,
  mutations
}