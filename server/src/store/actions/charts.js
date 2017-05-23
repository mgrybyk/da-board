const _ = require('lodash')

const actions = {
  updateCharts: ({ state, commit, dispatch }) => {
    let { FAILED, PASSED, RUNNING, NOT_EXECUTED } = state.executionStatuses

    Object.keys(state.charts).forEach(chartName => {
      if (chartName === '__init') return
      let chart = Array.from(Array(Object.keys(state.executionStatuses).length), () => 0)
      let stageName = chartName.substring(0, chartName.lastIndexOf('_'))

      Object.keys(state.configs).forEach(configName => {
        let tile = state.tiles[configName]
        let config = state.configs[configName]
        let stage = tile && tile.stages ? tile.stages[stageName] : null
        let integration = config.integration ? config.integration.name : null

        if (config.disabled || state.charts[chartName].integration !== integration) {
          // skip disabled config and configs that do not match chart integration type
        } else if (chartName.startsWith('Processes_')) {
          //
          // Processes chart
          //
          if (!tile || !tile.isValid || tile.isFailure === undefined) {
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
          if (!config.stages || !config.stages.includes(stageName)) {
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
        if (state.charts.__init) {
          commit('deleteChart', chartName)
        }
      } else {
        commit('updateChart', { name: chartName, data: chart })
      }
    })
  }
}

module.exports = actions
