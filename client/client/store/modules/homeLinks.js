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
  }
}

export default {
  state,
  mutations
}
