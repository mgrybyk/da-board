import * as types from '../mutation-types'

const state = {
  package: '',
  number: ''
}

const mutations = {
  [types.SOCKET_BUILD] (state, build) {
    state.package = build.package
    if (build.number) state.number = build.number
  }
}

export default {
  state,
  mutations
}
