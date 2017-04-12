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
  },

  updateHomelinkDb ({ state, commit, dispatch }, data) {
    let condition = {}
    if (data._id) {
      condition._id = data._id
    } else {
      condition.name = data.name
    }
    HomeLinks.getOneBy(condition, (err, homelink) => {
      if (err) {
        log.error(err)
        return dispatch('notifyDialogErr', Object.assign({}, data, { err }))
      }

      let prevName = undefined
      if (!homelink) {
        homelink = new HomeLinks(data)
      } else {
        if (homelink.name !== data.name) {
          prevName = homelink.name
        }
        Object.keys(data).forEach(key => {
          if (!key.startsWith('_') && (homelink[key] !== data[key])) {
            homelink[key] = data[key]
            homelink.markModified(key)
          }
        })
      }

      homelink.save(err => {
        if (err) {
          log.error(err)
          return dispatch('notifyDialogErr', Object.assign({}, data, { err }))
        }

        dispatch('notifyDialogOk', data)
        $store.dispatch('updateHomelink', Object.assign({}, homelink.toObject(), { prevName }))
        if (prevName) {
          commit('deleteHomelink', prevName)
        }
      })
    })
  },

  removeHomelinkDb ({ state, commit, dispatch }, data) {
    HomeLinks.removeOne(data.name, (err, doc) => {
      if (err || !doc) {
        log.error(err)
        return dispatch('notifyDeleteErr', Object.assign({}, data, { err }))
      }
      dispatch('notifyDeleteOk', data)

      commit('deleteHomelink', data.name)

      io.emit('SOCKET_HOMELINKS_DELETE', { name: data.name })
    })
  }
}

module.exports = actions
