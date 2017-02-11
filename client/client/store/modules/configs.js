import * as types from '../mutation-types'

const state = {
  data: {}
}

const mutations = {
  [types.SOCKET_CONFIGS] (state, data) {
    state.data = data
  },

  [types.SOCKET_CONFIGS_UPDATE] (state, config) {
    let configs = {...state.data}
    configs[config.name] = config
    state.data = configs
  }
}

export default {
  state,
  mutations
}
