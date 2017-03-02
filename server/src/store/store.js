const Manager = require('./manager')
const actions = require('./actions')
const getters = require('./getters')
const mutations = require('./mutations')

const state = {
  // testStatuses: {
  //   FAILED: 'failed',
  //   PASSED: 'passed',
  //   RUNNING: 'running'
  // },
  // chartStatuses: {
  //   FAILED: 0,
  //   PASSED: 1,
  //   RUNNING: 2,
  //   NOT_EXECUTED: 3
  // },
  executionStatuses: {
    FAILED: { idx: 0, name: 'failed' },
    PASSED: { idx: 1, name: 'passed' },
    RUNNING: { idx: 2, name: 'running' },
    NOT_EXECUTED: { idx: 3, name: null }
  },
  charts: {
    init: false
  },
  tiles: {},
  configs: {},
  build: {},
  integrations: {},
  stageCharts: {},
  homeLinks: {}
}

Manager.use({
  state,
  getters,
  actions,
  mutations
})

module.exports = Manager
