const Build = require('../../models/Build')

const actions = {
  async setBuild ({ commit }) {
    return Build.getOne((err, result) => {
      if (err) return log.error(err)

      commit('updateBuild', result.toObject())
    })
  },

  updateBuild ({ state, commit }, build) {
    commit('updateBuild', build)
    io.emit('SOCKET_BUILD', state.build)
  }
}

module.exports = actions
