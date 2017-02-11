const Manager = require('./manager')
const actions = require('./actions')
const getters = require('./getters')
const mutations = require('./mutations')

const state = {
  testStatuses: {
    FAILED: 'failed',
    PASSED: 'passed',
    RUNNING: 'running'
  },
  chartStatuses: {
    FAILED: 0,
    PASSED: 1,
    RUNNING: 2,
    NOT_EXECUTED: 3
  },
  homeCharts: {
    uiTests: [],
    restTests: [],
    installerTests: [],
    init: false
  },
  dashboard: {},
  configs: {},
  build: {}
}

Manager.use({
  state,
  getters,
  actions,
  mutations
})

module.exports = Manager
