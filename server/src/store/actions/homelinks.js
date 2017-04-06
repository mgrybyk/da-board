const HomeLinks = require('../../models/HomeLinks')

const actions = {
  async setHomelinks ({ commit, dispatch }) {
    return HomeLinks.getAll((err, results) => {
      if (err) return log.error(err)

      results.forEach(val => commit('updateHomelink', val.toObject()))
    })
  },

  updateHomelink ({ state, commit, dispatch }, item) {
    commit('updateHomelink', item)
    io.emit('SOCKET_HOMELINKS_UPDATE_ONE', state.homelinks[item.name])
  }
}

module.exports = actions
