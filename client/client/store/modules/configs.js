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
    if (config.prevName) {
      delete configs[config.prevName]
    }
    configs[config.name] = config
    state.data = configs
  },

  [types.SOCKET_CONFIGS_DELETE] (state, config) {
    delete state.data[config.name]
    state.data = {...state.data}
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
