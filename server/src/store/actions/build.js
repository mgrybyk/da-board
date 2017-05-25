const Builds = require('../../models/Builds')

const actions = {
  async setBuilds ({ commit }) {
    return Builds.getAll((err, results) => {
      if (err) return log.error(err)

      results.forEach(val => commit('updateBuild', val.toObject()))
    })
  },

  updateBuild ({ state, commit }, build) {
    commit('updateBuild', build)
    io.emit('SOCKET_BUILDS_UPDATE_ONE', state.builds[build.integration])
  },

  updateBuildsDb ({ state, commit, dispatch }, data) {
    let condition = {}
    if (data._id) {
      condition._id = data._id
    } else {
      condition.integration = data.integration
    }
    Builds.getOneBy(condition, (err, build) => {
      if (err) {
        log.error(err)
        return dispatch('notifyDialogErr', Object.assign({}, data, { name: data.integration }, { err }))
      }

      let prevIntegration
      if (!build) {
        build = new Builds(data)
      } else {
        if (build.integration !== data.integration) {
          prevIntegration = build.integration
        }
        Object.keys(data).forEach(key => {
          if (!key.startsWith('_') && (build[key] !== data[key])) {
            build[key] = data[key]
            build.markModified(key)
          }
        })
      }

      build.save(err => {
        if (err) {
          log.error(err)
          return dispatch('notifyDialogErr', Object.assign({}, data, { name: data.integration }, { err }))
        }

        dispatch('notifyDialogOk', Object.assign({}, data, { name: data.integration }))
        $store.dispatch('updateBuild', Object.assign({}, build.toObject(), { prevIntegration }))
        if (prevIntegration) {
          commit('deleteBuild', prevIntegration)
        }
      })
    })
  },

  removeBuildsDb ({ state, commit, dispatch }, data) {
    Builds.removeOne(data.name, (err, doc) => {
      if (err || !doc) {
        log.error(err)
        return dispatch('notifyDeleteErr', Object.assign({}, data, { err }))
      }
      dispatch('notifyDeleteOk', data)

      commit('deleteBuild', data.name)

      io.emit('SOCKET_BUILDS_DELETE', { integration: data.name })
    })
  }
}

module.exports = actions
