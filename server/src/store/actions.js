const Build = require('../models/Build')
const Configs = require('../models/Configs')
const Dashboard = require('../models/Dashboard')

const actions = {
  async setConfigs ({ commit }) {
    return Configs.getAllConfigs((err, results) => {
      if (err) return log.error(err)
      results.forEach(val => {
        commit('updateConfig', val.toObject())
      })
    })
  },

  async setBuild ({ commit }) {
    return Build.getBuild((err, result) => {
      if (err) return log.error(err)
      commit('updateBuild', result.toObject())
    })
  },

  async setDashboard ({ commit, dispatch }) {
    return Dashboard.getDashboard((err, results) => {
      if (err) return log.error(err)
      results.forEach(val => {
        commit('updateDashboard', val.toObject())
      })
      dispatch('updateHomeCharts')
      commit('homeChartsInitiated', true)
    })
  },

  updateHomeCharts: ({ state, commit }) => {
    let uiTests = [0, 0, 0, 0]
    let restTests = [0, 0, 0, 0]
    let installerTests = [0, 0, 0, 0]
    let { FAILED, PASSED, RUNNING, NOT_EXECUTED } = state.chartStatuses
    let testStatuses = state.testStatuses

    Object.keys(state.dashboard).forEach(key => {
      let item = state.dashboard[key]
      if (!item.test) {
        console.log('MISSING TEST PROP', item)
        item.test = {}
      }
      if (!item.isValid) {
        installerTests[NOT_EXECUTED]++
        restTests[NOT_EXECUTED]++
        if (state.configs[key] && state.configs[key].browser) {
          uiTests[NOT_EXECUTED]++
        }
      } else {
        if (item.isRunning) {
          installerTests[RUNNING]++
        } else { item.isFailure ? installerTests[FAILED]++ : installerTests[PASSED]++ }

        if (item.test.restState) {
          if (item.test.restState === testStatuses.RUNNING) {
            restTests[RUNNING]++
          } else { (item.test.restState === testStatuses.PASSED) ? restTests[PASSED]++ : restTests[FAILED]++ }
        } else restTests[NOT_EXECUTED]++

        if (state.configs[key] && state.configs[key].browser) {
          if (item.test.uiState) {
            if (item.test.uiState === testStatuses.RUNNING) {
              uiTests[RUNNING]++
            } else { (item.test.uiState === testStatuses.PASSED) ? uiTests[PASSED]++ : uiTests[FAILED]++ }
          } else uiTests[NOT_EXECUTED]++
        }
      }
    })

    commit('updateChart_installer', installerTests)
    commit('updateChart_ui', uiTests)
    commit('updateChart_rest', restTests)
  },

  updateDashboardItem ({ state, commit, dispatch }, item) {
    if (!state.homeCharts.init) return
    commit('updateDashboard', item)
    dispatch('updateHomeCharts')
    io.emit('SOCKET_DASHBOARD_UPDATE_TILE', state.dashboard[item.name])
  },

  resultsChanged () {
    io.emit('SOCKET_RESULTS_CHANGED')
  },

  updateBuild ({ state, commit }, build) {
    commit('updateBuild', build)
    io.emit('SOCKET_BUILD', state.build)
  },

  updateConfig ({ state, commit }, config) {
    commit('updateConfig', config)
    io.emit('SOCKET_CONFIGS_UPDATE', state.configs[config.name])
  },

  checkValidity ({ state, commit, dispatch }) {
    Dashboard.update({ 'package': { '$ne': state.build.package } }, { 'isValid': false }, { multi: true }, (err, num) => {
      if (err) return log.error(err)
      dispatch('setDashboard')
    })
  }
}

module.exports = actions
