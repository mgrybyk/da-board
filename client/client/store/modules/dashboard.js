import * as types from '../mutation-types'

const state = {
  data: {}
}

const mutations = {
  [types.SOCKET_DASHBOARD] (state, data) {
    state.data = data
  },

  [types.SOCKET_DASHBOARD_UPDATE_TILE] (state, tile) {
    let dashboard = {...state.data}
    dashboard[tile.name] = tile
    state.data = dashboard
  }
}

export default {
  state,
  mutations
}
