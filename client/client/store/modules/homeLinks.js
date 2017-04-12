import * as types from '../mutation-types'

const state = {
  data: {}
}

const mutations = {
  [types.SOCKET_HOMELINKS] (state, data) {
    state.data = data
  },

  [types.SOCKET_HOMELINKS_UPDATE_ONE] (state, homeLink) {
    let homeLinks = {...state.data}
    homeLinks[homeLink.name] = homeLink
    state.data = homeLinks
  },

  [types.SOCKET_HOMELINKS_DELETE] (state, homeLink) {
    delete state.data[homeLink.name]
    state.data = {...state.data}
  }
}

export default {
  state,
  mutations
}
