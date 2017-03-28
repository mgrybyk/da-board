import * as types from '../mutation-types'

const state = {
  data: {}
}

const mutations = {
  [types.SOCKET_CHARTS_UPDATE_ONE] (state, chart) {
    state.data[chart.name] = { series: chart.data, displayName: chart.displayName }
    state.data = {...state.data}
  },
  [types.SOCKET_CHART_CHANGED] (state, chart) {
    if (!state.data[chart.name]) return
    state.data[chart.name].changed = chart.changed
  }
}

export default {
  state,
  mutations
}
