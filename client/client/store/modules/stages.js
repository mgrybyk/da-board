import * as types from '../mutation-types'

const state = {
  data: {}
}

const mutations = {
  [types.SOCKET_STAGES] (state, data) {
    state.data = data
  },

  [types.SOCKET_STAGES_UPDATE_ONE] (state, stage) {
    let stages = {...state.data}
    if (stage.prevName) {
      delete stages[stage.prevName]
    }
    stages[stage.name] = stage
    state.data = stages
  },

  [types.SOCKET_STAGES_DELETE] (state, stage) {
    delete state.data[stage.name]
    state.data = {...state.data}
  }
}

export default {
  state,
  mutations
}
