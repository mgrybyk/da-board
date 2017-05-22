'use strict'
const User = require('./models/User')

module.exports = io => {
  io.on('connection', function (socket) {
    // tiles
    addGetListener(socket, 'TILES', 'tiles')

    // build
    addGetListener(socket, 'BUILD', 'build')

    // integrations
    addGetUpdateDeleteListeners(socket, 'INTEGRATIONS', 'integrations', 'Integration')

    // stages
    addGetUpdateDeleteListeners(socket, 'STAGES', 'stageCharts', 'Stage')

    // homelinks
    addGetUpdateDeleteListeners(socket, 'HOMELINKS', 'homelinks', 'Homelink')

    // time sync
    socket.on('TIME_SYNC', (data) => {
      socket.emit('SOCKET_TIME_SYNC', { time: new Date().getTime() })
    })

    // configs
    addGetUpdateDeleteListeners(socket, 'CONFIGS', 'configs', 'Config')
    socket.on('CONFIGS_UPDATE_SORTING', (data) => {
      $store.dispatch('updateConfigSorting', data)
      $store.dispatch('recalcSorting', data)
    })

    // run process
    socket.on('INTEGRATION_ACTION', (data) => {
      $store.dispatch('integrationAction', Object.assign({}, data, { '__socket': socket }))
    })

    // charts
    socket.on('GET_CHARTS', (data) => {
      Object.keys($store.getters.charts).forEach(key => {
        let chart = $store.getters.charts[key]
        if (chart.data) {
          socket.emit('SOCKET_CHARTS_UPDATE_ONE', chart)
        }
      })
    })

    // set flag
    socket.on('FLAG_SET', (data) => {
      $store.dispatch('setFlag', Object.assign({}, data, { '__socket': socket }))
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

function addGetUpdateDeleteListeners (socket, eventType, getterType, dispatcherType) {
  addGetListener(socket, eventType, getterType)
  socket.on(`${eventType}_UPDATE_ONE`, (data) => {
    Object.keys(data).forEach(key => { data[key] = data[key] === null ? undefined : data[key] })
    $store.dispatch(`update${dispatcherType}Db`, Object.assign({}, data, { '__socket': socket }))
  })
  socket.on(`${eventType}_NEW`, (data) => {
    if (!$store.getters[getterType][data.name]) {
      $store.dispatch(`update${dispatcherType}Db`, Object.assign({}, data, { '__socket': socket }))
    } else {
      $store.dispatch('notifyDialogErr', Object.assign({}, data, { err: `${dispatcherType} with name '${data.name}' already exists.` }, { '__socket': socket }))
    }
  })
  socket.on(`${eventType}_DELETE`, (data) => {
    $store.dispatch(`remove${dispatcherType}Db`, Object.assign({}, data, { '__socket': socket }))
  })
}

function addGetListener (socket, eventType, getterType) {
  socket.on(`GET_${eventType}`, (data) => {
    socket.emit(`SOCKET_${eventType}`, $store.getters[getterType])
  })
}
