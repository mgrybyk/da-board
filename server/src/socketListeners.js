'use strict'
const User = require('./models/User')

module.exports = io => {
  io.on('connection', function (socket) {
    console.log('a user connected')

    // charts
    socket.on('GET_CHARTS', (data) => {
      Object.keys($store.getters.charts).forEach(key => {
        let chart = $store.getters.charts[key]
        if (chart.data) {
          socket.emit('SOCKET_CHARTS_UPDATE_ONE', chart)
        }
      })
    })

    // tiles
    socket.on('GET_TILES', (data) => {
      socket.emit('SOCKET_TILES', $store.getters.tiles)
    })

    // configs
    socket.on('GET_CONFIGS', (data) => {
      socket.emit('SOCKET_CONFIGS', $store.getters.configs)
    })
    socket.on('CONFIGS_UPDATE_SORTING', (data) => {
      $store.dispatch('updateConfigSorting', data)
      $store.dispatch('recalcSorting', data)
    })
    socket.on('CONFIGS_UPDATE_ONE', (data) => {
      console.log('CONFIGS_UPDATE_ONE')
      Object.keys(data).forEach(key => data[key] = data[key] === null ? undefined : data[key])
      $store.dispatch('updateConfigDb', Object.assign({}, data, { '__socket': socket }))
    })
    socket.on('CONFIGS_NEW', (data) => {
      console.log('CONFIGS_NEW')
      if (!$store.getters.configs[data.name]) {
        $store.dispatch('updateConfigDb', Object.assign({}, data, { '__socket': socket }))
      } else {
        $store.dispatch('notifyDialogErr', Object.assign({}, data, { err: `config with name '${data.name}' already exists.` }, { '__socket': socket }))
      }
    })
    socket.on('CONFIGS_DELETE', (data) => {
      console.log('CONFIGS_DELETE')
      $store.dispatch('removeConfigDb', Object.assign({}, data, { '__socket': socket }))
    })

    // build
    socket.on('GET_BUILD', (data) => {
      socket.emit('SOCKET_BUILD', $store.getters.build)
    })

    // integrations
    socket.on('GET_INTEGRATIONS', (data) => {
      socket.emit('SOCKET_INTEGRATIONS', $store.getters.integrations)
    })
    socket.on('INTEGRATIONS_UPDATE_ONE', (data) => {
      console.log('INTEGRATIONS_UPDATE_ONE')
      Object.keys(data).forEach(key => data[key] = data[key] === null ? undefined : data[key])
      $store.dispatch('updateIntegrationDb', Object.assign({}, data, { '__socket': socket }))
    })
    socket.on('INTEGRATIONS_NEW', (data) => {
      console.log('INTEGRATIONS_NEW')
      if (!$store.getters.integrations[data.name]) {
        $store.dispatch('updateIntegrationDb', Object.assign({}, data, { '__socket': socket }))
      } else {
        $store.dispatch('notifyDialogErr', Object.assign({}, data, { err: `Integration with name '${data.name}' already exists.` }, { '__socket': socket }))
      }
    })
    socket.on('INTEGRATIONS_DELETE', (data) => {
      console.log('INTEGRATIONS_DELETE')
      $store.dispatch('removeIntegrationDb', Object.assign({}, data, { '__socket': socket }))
    })

    // stages
    socket.on('GET_STAGES', (data) => {
      socket.emit('SOCKET_STAGES', $store.getters.stageCharts)
    })
    socket.on('STAGES_UPDATE_ONE', (data) => {
      console.log('STAGES_UPDATE_ONE')
      Object.keys(data).forEach(key => data[key] = data[key] === null ? undefined : data[key])
      $store.dispatch('updateStageDb', Object.assign({}, data, { '__socket': socket }))
    })
    socket.on('STAGES_NEW', (data) => {
      console.log('STAGES_NEW')
      if (!$store.getters.stageCharts[data.name]) {
        $store.dispatch('updateStageDb', Object.assign({}, data, { '__socket': socket }))
      } else {
        $store.dispatch('notifyDialogErr', Object.assign({}, data, { err: `Stage with name '${data.name}' already exists.` }, { '__socket': socket }))
      }
    })
    socket.on('STAGES_DELETE', (data) => {
      console.log('STAGES_DELETE')
      $store.dispatch('removeStageDb', Object.assign({}, data, { '__socket': socket }))
    })

    // homelinks
    socket.on('GET_HOMELINKS', (data) => {
      socket.emit('SOCKET_HOMELINKS', $store.getters.homelinks)
    })
    socket.on('HOMELINKS_UPDATE_ONE', (data) => {
      console.log('HOMELINKS_UPDATE_ONE')
      Object.keys(data).forEach(key => data[key] = data[key] === null ? undefined : data[key])
      $store.dispatch('updateHomelinkDb', Object.assign({}, data, { '__socket': socket }))
    })
    socket.on('HOMELINKS_NEW', (data) => {
      console.log('HOMELINKS_NEW')
      if (!$store.getters.homelinks[data.name]) {
        $store.dispatch('updateHomelinkDb', Object.assign({}, data, { '__socket': socket }))
      } else {
        $store.dispatch('notifyDialogErr', Object.assign({}, data, { err: `Link with name '${data.name}' already exists.` }, { '__socket': socket }))
      }
    })
    socket.on('HOMELINKS_DELETE', (data) => {
      console.log('HOMELINKS_DELETE')
      $store.dispatch('removeHomelinkDb', Object.assign({}, data, { '__socket': socket }))
    })

    // users
    socket.on('GET_USERS', (data) => {
      User.getAll((err, results) => {
        if (err) return log.error(err)

        let users = {}

        results.forEach(val => users[val.username] = val.toObject())

        socket.emit('SOCKET_USERS', users)
      })
    })

    // time sync
    socket.on('TIME_SYNC', (data) => {
      socket.emit('SOCKET_TIME_SYNC', { time: new Date().getTime() })
    })

    // run process
    socket.on('INTEGRATION_ACTION', (data) => {
      console.log('INTEGRATION_ACTION', data.action)
      $store.dispatch('integrationAction', Object.assign({}, data, { '__socket': socket }))
    })
  })
}
