const Tiles = require('../../models/Tiles')

const actions = {
  async setTiles ({ commit, dispatch }) {
    return Tiles.getAll((err, results) => {
      if (err) return log.error(err)

      results.forEach(val => commit('updateTile', val.toObject()))

      dispatch('updateCharts')
      commit('chartsInitiated', true)
    })
  },

  updateTile ({ state, commit, dispatch }, item) {
    if (!state.charts.init) return

    commit('updateTile', item)
    io.emit('SOCKET_TILES_UPDATE_ONE', state.tiles[item.name])

    dispatch('updateCharts')
  },

  checkValidity ({ state, commit, dispatch }) {
    Tiles.update({ 'package': { '$ne': state.build.package } }, { 'isValid': false }, { multi: true }, (err, num) => {
      if (err) return log.error(err)

      dispatch('setTiles')
    })
  }
}

module.exports = actions
