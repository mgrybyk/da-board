const _ = require('lodash')

const mutations = {
  updateConfig (state, config) {
    if (Object.keys(state.configs).length === 0) {
      state.charts.Processes = { name: 'Processes' }
    }

    state.configs[config.name] = config
  },
  deleteConfig (state, name) {
    delete state.configs[name]
  },

  updateTile (state, entry) {
    state.tiles[entry.name] = entry
  },

  updateIntegration (state, entry) {
    state.integrations[entry.name] = entry
  },

  updateStage (state, stage) {
    state.stageCharts[stage.name] = stage
  },

  updateBuild (state, build) {
    state.build = build
  },

  initChart (state, name) {
    if (!state.charts[name]) {
      state.charts[name] = { name: name }
    }
  },
  deleteChart (state, name) {
    delete state.charts[name]
    io.emit('SOCKET_CHART_DELETE', { name: name })
  },
  updateChart (state, chart) {
    if (_.isEqual(state.charts[chart.name].data, chart.data)) return
    state.charts[chart.name].data = chart.data

    if (state.charts.init) io.emit('SOCKET_CHART', chart)
  },
  chartsInitiated (state) {
    state.charts.init = true
  }
}

module.exports = mutations
