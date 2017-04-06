const getters = {
  charts: state => state.charts,
  stageCharts: state => state.stageCharts,

  tiles: state => state.tiles,

  configs: state => state.configs,

  build: state => state.build,

  executionStatuses: state => state.executionStatuses,

  integrations: state => state.integrations,

  homelinks: state => state.homelinks
}

module.exports = getters
