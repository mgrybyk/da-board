import * as types from '../mutation-types'

const state = {
  data: {}
}

const mutations = {
  [types.SOCKET_USERS] (state, data) {
    state.data = data
  },

  [types.SOCKET_USERS_UPDATE_ONE] (state, user) {
    let users = {...state.data}
    users[user.username] = user
    state.data = users
  },

  [types.SOCKET_USERS_DELETE] (state, user) {
    delete state.data[user.name]
    state.data = {...state.data}
  }
}

export default {
  state,
  mutations
}
