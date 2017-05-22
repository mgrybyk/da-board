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
      dispatch('removeChartOfStage', stage.name)
    }

    io.emit('SOCKET_STAGES_UPDATE_ONE', state.stageCharts[stage.name])
  },

  updateStageDb ({ state, commit, dispatch }, data) {
    let condition = {}
    if (data._id) {
      condition._id = data._id
    } else {
      condition.name = data.name
    }
    StageCharts.getOneBy(condition, (err, stage) => {
      if (err) {
        log.error(err)
        return dispatch('notifyDialogErr', Object.assign({}, data, { err }))
      }

      let prevName
      if (!stage) {
        stage = new StageCharts(data)
      } else {
        if (stage.name !== data.name) {
          prevName = stage.name
        }
        Object.keys(data).forEach(key => {
          if (!key.startsWith('_') && (stage[key] !== data[key])) {
            stage[key] = data[key]
            stage.markModified(key)
          }
        })
      }

      stage.save(err => {
        if (err) {
          log.error(err)
          return dispatch('notifyDialogErr', Object.assign({}, data, { err }))
        }

        dispatch('notifyDialogOk', data)
        $store.dispatch('updateStage', Object.assign({}, stage.toObject(), { prevName }))
        if (prevName) {
          commit('deleteStage', prevName)

          dispatch('removeChartOfStage', prevName)
        }
      })
    })
  },

  removeStageDb ({ state, commit, dispatch }, data) {
    StageCharts.removeOne(data.name, (err, doc) => {
      if (err || !doc) {
        log.error(err)
        return dispatch('notifyDeleteErr', Object.assign({}, data, { err }))
      }
      dispatch('notifyDeleteOk', data)

      commit('deleteStage', data.name)
      dispatch('removeChartOfStage', data.name)

      io.emit('SOCKET_STAGES_DELETE', { name: data.name })
    })
  },

  removeChartOfStage ({ state, commit, dispatch }, stageName) {
    commit('deleteChart', stageName)
    Object.keys(state.integrations).forEach(integrationName => {
      let chartName = `${stageName}_${integrationName}`
      commit('deleteChart', chartName)
    })
  }
}

module.exports = actions
