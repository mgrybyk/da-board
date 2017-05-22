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
    if (!state.charts.__init) return

    commit('updateTile', item)
    io.emit('SOCKET_TILES_UPDATE_ONE', state.tiles[item.name])

    dispatch('updateCharts')
  },

  checkValidity ({ state, commit, dispatch }) {
    return Tiles.update({ 'package': { '$ne': state.build.package } }, { 'isValid': false }, { multi: true }, (err, num) => {
      if (err) return log.error(err)

      dispatch('setTiles')
    })
  },

  checkValidityStartup ({ state, commit, dispatch }) {
    dispatch('checkValidity')
    Tiles.update({ 'package': { '$eq': state.build.package } }, { 'isValid': true }, { multi: true }, (err, num) => {
      if (err) return log.error(err)

      dispatch('setTiles')
    })
  },

  setFlag ({ state, commit, dispatch }, data) {
    Tiles.getOne(data.name, (err, tile) => {
      if (err) return log.error(err)

      if (!tile) {
        tile = new Tiles()
        tile.name = data.name
      }

      if (tile.userFlag && tile.userFlag.flag === data.flag && tile.userFlag.user === data.__socket.request.user.displayName) {
        tile.userFlag = undefined
      } else {
        tile.userFlag = {
          flag: data.flag,
          timestamp: new Date().getTime(),
          user: data.__socket.request.user.displayName
        }
      }

      tile.save(err => {
        if (err) return log.error(err)

        dispatch('updateTile', tile.toObject())
      })
    })
  }
}

module.exports = actions
