import * as types from '../mutation-types'

const state = {
  timeDiff: 0
}

const mutations = {
  [types.SOCKET_TIME_SYNC] (state, diff) {
    state.timeDiff = diff
  }
}

export default {
  state,
  mutations
}
