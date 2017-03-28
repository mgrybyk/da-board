const StageCharts = require('../../models/StageCharts')

const actions = {
  async setStages ({ state, commit }) {
    return StageCharts.getAll((err, results) => {
      if (err) return log.error(err)

      results.forEach(val => {
        commit('updateStage', val.toObject())
        if (val.isChart === true) {
          commit('initChart', { name: val.name, displayName: val.displayName })
        }
      })
    })
  },

  updateStage ({ state, commit, dispatch }, stage) {
    commit('updateStage', stage)

    if (stage.isChart) {
      commit('initChart', stage)
    } else {
      commit('deleteChart', stage.name)
    }

    io.emit('SOCKET_STAGE_UPDATE_ONE', state.stageCharts[stage.name])
  }
}

module.exports = actions
