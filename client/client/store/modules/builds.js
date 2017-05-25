import * as types from '../mutation-types'

const state = {
  data: {}
}

const mutations = {
  [types.SOCKET_BUILDS] (state, data) {
    state.data = data
  },

  [types.SOCKET_BUILDS_UPDATE_ONE] (state, build) {
    let builds = {...state.data}
    if (build.prevIntegration) {
      delete builds[build.prevIntegration]
    }
    builds[build.integration] = build
    state.data = builds
  },

  [types.SOCKET_BUILDS_DELETE] (state, build) {
    delete state.data[build.integration]
    state.data = {...state.data}
  }
}

export default {
  state,
  mutations
}
