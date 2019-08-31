const Tiles = require('../../models/Tiles')

const actions = {
  async setTiles ({ commit, dispatch }) {
    return Tiles.getAll((err, results) => {
      if (err) return log.error(err)

      results.forEach(val => commit('updateTile', val.toObject()))
    })
  },

  updateTile ({ state, commit, dispatch }, item) {
    commit('updateTile', item)
    io.emit('SOCKET_TILES_UPDATE_ONE', state.tiles[item.name])
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

      tile.save((err, savedDoc, hz) => {
        if (err) return log.error(err)

        dispatch('updateTile', savedDoc.toObject())
      })
    })
  },

  removeTileDb ({ state, commit, dispatch }, data) {
    Tiles.removeOne(data.name, (err, doc) => {
      if (err) {
        return log.error(err)
      }
      if (doc) {
        commit('deleteTile', data.name)
      }
    })
  },
}

module.exports = actions
