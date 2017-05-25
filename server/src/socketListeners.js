'use strict'
const User = require('./models/User')

module.exports = io => {
  io.on('connection', function (socket) {
    // tiles
    addGetListener(socket, 'TILES', 'tiles')

    // integrations
    addGetUpdateDeleteListeners(socket, 'INTEGRATIONS', 'integrations', 'Integration')

    // builds
    addGetUpdateDeleteListeners(socket, 'BUILDS', 'builds', 'Builds', 'integration')

    // homelinks
    addGetUpdateDeleteListeners(socket, 'HOMELINKS', 'homelinks', 'Homelink')

    // time sync
    socket.on('TIME_SYNC', (data) => {
      socket.emit('SOCKET_TIME_SYNC', { time: new Date().getTime() })
    })

    // configs
    addGetUpdateDeleteListeners(socket, 'CONFIGS', 'configs', 'Config')
    socket.on('CONFIGS_UPDATE_SORTING', (data) => {
      if (!socket.request.isAuthenticated()) return
      $store.dispatch('updateConfigSorting', data)
      $store.dispatch('recalcSorting', data)
    })

    // run process
    socket.on('INTEGRATION_ACTION', (data) => {
      if (!socket.request.isAuthenticated()) return
      $store.dispatch('integrationAction', Object.assign({}, data, { '__socket': socket }))
    })

    // set flag
    socket.on('FLAG_SET', (data) => {
      if (!socket.request.isAuthenticated()) return
      $store.dispatch('setFlag', Object.assign({}, data, { '__socket': socket }))
    })

    // logout
    socket.on('LOGOUT', () => {
      if (!socket.request.isAuthenticated()) return
      socket.request.logout()
    })

    // users
    socket.on('GET_USERS', (data) => {
      User.getAll((err, results) => {
        if (err) return log.error(err)

        let users = {}

        results.forEach(val => { users[val.username] = val.toObject() })

        socket.emit('SOCKET_USERS', users)
      })
    })
  })
}

function addGetUpdateDeleteListeners (socket, eventType, getterType, dispatcherType, propName) {
  addGetListener(socket, eventType, getterType)
  socket.on(`${eventType}_UPDATE_ONE`, (data) => {
    if (!socket.request.isAuthenticated()) return
    Object.keys(data).forEach(key => { data[key] = data[key] === null ? undefined : data[key] })
    $store.dispatch(`update${dispatcherType}Db`, Object.assign({}, data, { '__socket': socket }))
  })
  socket.on(`${eventType}_NEW`, (data) => {
    let pName = propName || 'name'
    if (!socket.request.isAuthenticated()) return
    if (!$store.getters[getterType][data[pName]]) {
      $store.dispatch(`update${dispatcherType}Db`, Object.assign({}, data, { '__socket': socket }))
    } else {
      $store.dispatch('notifyDialogErr', Object.assign({}, data, { err: `${dispatcherType} with ${pName} '${data[pName]}' already exists.` }, { '__socket': socket }))
    }
  })
  socket.on(`${eventType}_DELETE`, (data) => {
    if (!socket.request.isAuthenticated()) return
    $store.dispatch(`remove${dispatcherType}Db`, Object.assign({}, data, { '__socket': socket }))
  })
}

function addGetListener (socket, eventType, getterType) {
  socket.on(`GET_${eventType}`, (data) => {
    socket.emit(`SOCKET_${eventType}`, $store.getters[getterType])
  })
}
