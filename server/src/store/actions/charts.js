const _ = require('lodash')

const actions = {
  updateCharts: ({ state, commit, dispatch }) => {
    let { FAILED, PASSED, RUNNING, NOT_EXECUTED } = state.executionStatuses

    Object.keys(state.charts).forEach(chartName => {
      let chart = Array.from(Array(Object.keys(state.executionStatuses).length), () => 0)

      Object.keys(state.configs).forEach(configName => {
        let tile = state.tiles[configName]
        let config = state.configs[configName]
        let stage = tile && tile.stages ? tile.stages[chartName] : null

        if (config.disabled) {
          // skip disabled config
        } else if (chartName === 'Processes') {
          //
          // Processes chart
          //
          if (!tile || !tile.isValid) {
            chart[NOT_EXECUTED.idx]++
          } else {
            if (tile.isRunning) {
              chart[RUNNING.idx]++
            } else { tile.isFailure === false ? chart[PASSED.idx]++ : chart[FAILED.idx]++ }
          }
        } else {
          //
          // Any custom chart
          //
          if (!config.stages || !config.stages.includes(chartName)) {
            // config has no appropriate stage defined
          } else if (!tile || !tile.isValid || !stage) {
            chart[NOT_EXECUTED.idx]++
          } else {
            if (stage === RUNNING.name) {
              chart[RUNNING.idx]++
            } else { stage === PASSED.name ? chart[PASSED.idx]++ : chart[FAILED.idx]++ }
          }
        }
      })

      // commit chart
      if (_.isEqual(chart, Array.from(Array(Object.keys(state.executionStatuses).length), () => 0))) {
        if (state.charts.init) {
          io.emit('SOCKET_CHART_DELETE', { name: chartName })
        }
      } else {
        commit('updateChart', { name: chartName, data: chart })
      }
    })
  }
}

module.exports = actions
