import * as types from '../mutation-types'

const state = {
  isAuth: false,
  username: ''
}

const mutations = {
  [types.SET_AUTH] (state, data) {
    state.isAuth = data.isAuth
    state.username = data.username
  }
}

export default {
  state,
  mutations
}
