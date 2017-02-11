const _ = require('lodash')

const mutations = {
  updateConfig (state, config) {
    state.configs[config.name] = config
  },

  updateDashboard (state, entry) {
    if (!entry.test) {
      entry.test = {}
    }
    state.dashboard[entry.name] = entry
  },

  updateBuild (state, build) {
    state.build = build
  },

  updateChart_ui (state, chart) {
    if (_.isEqual(state.homeCharts.uiTests, chart)) return
    state.homeCharts.uiTests = chart
    if (state.homeCharts.init) io.emit('SOCKET_CHART_UI', chart)
  },
  updateChart_rest (state, chart) {
    if (_.isEqual(state.homeCharts.restTests, chart)) return
    state.homeCharts.restTests = chart
    if (state.homeCharts.init) io.emit('SOCKET_CHART_REST', chart)
  },
  updateChart_installer (state, chart) {
    if (_.isEqual(state.homeCharts.installerTests, chart)) return
    state.homeCharts.installerTests = chart
    if (state.homeCharts.init) io.emit('SOCKET_CHART_INSTALLER', chart)
  },
  homeChartsInitiated (state) {
    state.homeCharts.init = true
  }
}

module.exports = mutations
