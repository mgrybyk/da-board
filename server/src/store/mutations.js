const _ = require('lodash')

const mutations = {
  updateConfig (state, config) {
    if (Object.keys(state.configs).length === 0) {
      mutations.initChart(state, { name: 'Processes' })
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

  updateHomelink (state, entry) {
    state.homelinks[entry.name] = entry
  },

  updateStage (state, stage) {
    state.stageCharts[stage.name] = stage
  },

  updateBuild (state, build) {
    state.build = build
  },

  initChart (state, chart) {
    let displayName = chart.displayName || chart.name
    Object.keys(state.integrations).forEach(integrationName => {
      let chartName = `${chart.name}_${integrationName}`
      let displayNameIntegration = `${displayName} (${state.integrations[integrationName].displayName || integrationName})`
      if (!state.charts[chartName]) {
        state.charts[chartName] = { name: chartName, displayName: displayNameIntegration, integration: integrationName }
      } else if (state.charts[chartName].displayName !== displayNameIntegration) {
        state.charts[chartName].displayName = displayNameIntegration
      }
    })

    let chartName = `${chart.name}_${null}`
    if (!state.charts[chartName]) {
      state.charts[chartName] = { name: chartName, displayName: displayName, integration: null }
    }
  },
  deleteChart (state, name) {
    delete state.charts[name]
    io.emit('SOCKET_CHART_DELETE', { name: name })
  },
  updateChart (state, chart) {
    if (_.isEqual(state.charts[chart.name].data, chart.data)) return
    state.charts[chart.name].data = chart.data

    if (state.charts.__init) io.emit('SOCKET_CHARTS_UPDATE_ONE', chart)
  },
  chartsInitiated (state) {
    state.charts.__init = true
  }
}

module.exports = mutations
