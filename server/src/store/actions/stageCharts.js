const StageCharts = require('../../models/StageCharts')

const actions = {
  async setStages ({ commit }) {
    return StageCharts.getAll((err, results) => {
      if (err) return log.error(err)

      results.forEach(val => {
        commit('updateStage', val.toObject())
        if (val.isChart === true) {
          commit('initChart', val.name)
        }
      })
    })
  },

  updateStage ({ state, commit, dispatch }, stage) {
    commit('updateStage', stage)

    if (stage.isChart) {
      commit('initChart', stage.name)
    } else {
      commit('deleteChart', stage.name)
    }

    io.emit('SOCKET_STAGE_UPDATE_ONE', state.stageCharts[stage.name])
  }
}

module.exports = actions
