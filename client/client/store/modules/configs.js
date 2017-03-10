import * as types from '../mutation-types'

const state = {
  data: {}
}

const mutations = {
  [types.SOCKET_CONFIGS] (state, data) {
    state.data = data
  },

  [types.SOCKET_CONFIGS_UPDATE_ONE] (state, config) {
    let configs = {...state.data}
    configs[config.name] = config
    state.data = configs
  },

  [types.CONFIGS_UPDATE_SORTING] (state, config) {
    let configs = {...state.data}
    configs[config.name].sortBy = config.sortBy
    state.data = configs
  }
}

export default {
  state,
  mutations
}
