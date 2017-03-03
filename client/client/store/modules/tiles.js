import * as types from '../mutation-types'

const state = {
  data: {}
}

const mutations = {
  [types.SOCKET_TILES] (state, data) {
    state.data = data
  },

  [types.SOCKET_TILES_UPDATE_ONE] (state, tile) {
    let tiles = {...state.data}
    tiles[tile.name] = tile
    state.data = tiles
  }
}

export default {
  state,
  mutations
}
