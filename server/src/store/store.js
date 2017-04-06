const Manager = require('./manager')
const actions = require('./actions')
const getters = require('./getters')
const mutations = require('./mutations')

const state = {
  executionStatuses: {
    FAILED: { idx: 0, name: 'failed' },
    PASSED: { idx: 1, name: 'passed' },
    RUNNING: { idx: 2, name: 'running' },
    NOT_EXECUTED: { idx: 3, name: null }
  },
  charts: {
    __init: false
  },
  tiles: {},
  configs: {},
  build: {},
  integrations: {},
  stageCharts: {},
  homelinks: {}
}

Manager.use({
  state,
  getters,
  actions,
  mutations
})

module.exports = Manager
