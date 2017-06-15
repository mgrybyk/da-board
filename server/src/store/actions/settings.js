const Settings = require('../../models/Settings')

const actions = {
  async setSettings ({ commit, dispatch }) {
    return Settings.getAll((err, results) => {
      if (err) return log.error(err)

      results.forEach(val => commit('updateSettings', val.toObject()))
    })
  },

  updateSettings ({ state, commit, dispatch }, item) {
    commit('updateSettings', item)
    io.emit('SOCKET_SETTINGS_UPDATE_ONE', state.settings[item.name])
  },

  updateSettingsDb ({ state, commit, dispatch }, data) {
    let condition = {}
    if (data._id) {
      condition._id = data._id
    } else {
      condition.name = data.name
    }
    Settings.getOneBy(condition, (err, option) => {
      if (err) {
        log.error(err)
        return dispatch('notifyDialogErr', Object.assign({}, data, { err }))
      }

      if (!option) {
        option = new Settings(data)
      } else {
        Object.keys(data).forEach(key => {
          if (!key.startsWith('_') && (option[key] !== data[key])) {
            option[key] = data[key]
            option.markModified(key)
          }
        })
      }
      option.timestamp = new Date().getTime()

      option.save(err => {
        if (err) {
          log.error(err)
          return dispatch('notifyDialogErr', Object.assign({}, data, { err }))
        }

        dispatch('notifyDialogOk', data)
        $store.dispatch('updateSettings', Object.assign({}, option.toObject()))
      })
    })
  }
}

module.exports = actions
