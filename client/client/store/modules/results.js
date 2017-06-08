import * as types from '../mutation-types'

const state = {
  data: [],
  changed: true
}

const mutations = {
  [types.RESULTS_PUSH] (state, data) {
    state.data.push(...data)
  },

  [types.RESULTS_CLEAR] (state, data) {
    state.data = []
  },

  [types.SOCKET_RESULTS_CHANGED] (state, changed) {
    state.changed = changed
  }
}

export default {
  state,
  mutations
}
