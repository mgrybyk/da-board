import * as types from '../mutation-types'

const state = {
  data: {}
}

const mutations = {
  [types.SOCKET_SETTINGS] (state, data) {
    state.data = data
  },

  [types.SOCKET_SETTINGS_UPDATE_ONE] (state, option) {
    let settings = {...state.data}
    settings[option.name] = option
    state.data = settings
  }
}

export default {
  state,
  mutations
}
