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
    socket.on('USERS_UPDATE_ONE', (data) => {
      if (!socket.request.isAuthenticated()) return
      if (socket.request.user.username !== data.username && socket.request.user.username !== 'admin') return
      User.getOneBy({ _id: data._id }, (err, user) => {
        if (err || !user) {
          return $store.dispatch('notifyDialogErr', Object.assign({}, data, { err: `Failed to update user: ${user.username}` }, { '__socket': socket }))
        }
        user.displayName = data.displayName
        if (data.password && data.password.trim().length >= 3) user.password = User.encryptPassword(data.password.trim())
        user.save()
        $store.dispatch('notifyDialogOk', Object.assign({}, { name: user.username }, { '__socket': socket }))
        socket.emit('SOCKET_USERS_UPDATE_ONE', user.toObject())
      })
    })
    socket.on('USERS_RESET', (data) => {
      if (!socket.request.isAuthenticated()) return
      if (socket.request.user.username !== data.name && socket.request.user.username !== 'admin') return
      User.getOneBy({ username: data.name }, (err, user) => {
        if (err || !user) {
          return log.error('failed to reset password', err)
        }
        user.password = User.encryptPassword('password')
        user.save()
        $store.dispatch('notifyDialogOk', Object.assign({}, { name: user.username }, { '__socket': socket }))
      })
    })
    socket.on('USERS_DELETE', (data) => {
      if (!socket.request.isAuthenticated()) return
      if (socket.request.user.username !== 'admin' || data.name === 'admin') return
      User.removeOne(data.name, (err, doc) => {
        if (err || !doc) {
          return $store.dispatch('notifyDeleteErr', Object.assign({}, data, { err }))
        }
        $store.dispatch('notifyDeleteOk', Object.assign({}, data, { '__socket': socket }))
        io.emit('SOCKET_USERS_DELETE', { name: data.name })
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
  socket.on(`${eventType}_COPY`, (data) => {
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
