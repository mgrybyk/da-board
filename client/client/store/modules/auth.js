import * as types from '../mutation-types'

const state = {
  isAuth: window.localStorage.isAuth === 'true',
  username: window.localStorage.username || ''
}

const mutations = {
  [types.SET_AUTH] (state, data) {
    window.localStorage.isAuth = data.isAuth.toString()
    window.localStorage.username = data.username
    state.isAuth = data.isAuth
    state.username = data.username
  }
}

export default {
  state,
  mutations
}
