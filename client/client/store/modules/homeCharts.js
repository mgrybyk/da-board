import * as types from '../mutation-types'

const state = {
  restTests: { series: [], changed: false },
  uiTests: { series: [], changed: false },
  installerTests: { series: [], changed: false }
}

const mutations = {
  [types.SOCKET_CHART_UI] (state, data) {
    state.uiTests.series = data
  },
  [types.SOCKET_CHART_REST] (state, data) {
    state.restTests.series = data
  },
  [types.SOCKET_CHART_INSTALLER] (state, data) {
    state.installerTests.series = data
  },
  [types.SOCKET_CHART_UI_CHANGED] (state, changed) {
    state.uiTests.changed = changed
  },
  [types.SOCKET_CHART_REST_CHANGED] (state, changed) {
    state.restTests.changed = changed
  },
  [types.SOCKET_CHART_INSTALLER_CHANGED] (state, changed) {
    state.installerTests.changed = changed
  }
}

export default {
  state,
  mutations
}
