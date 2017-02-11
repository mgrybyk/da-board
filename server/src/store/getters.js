const getters = {
  chart_ui: state => state.homeCharts.uiTests,
  chart_installer: state => state.homeCharts.installerTests,
  chart_rest: state => state.homeCharts.restTests,

  dashboard: state => state.dashboard,

  configs: state => state.configs,

  build: state => state.build,

  testStatuses: state => state.testStatuses
}

module.exports = getters
