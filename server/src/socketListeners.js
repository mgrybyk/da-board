'use strict'

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
      $store.dispatch('updateConfigDb', Object.assign({}, data, {'__socket': socket }))
    })
    socket.on('CONFIGS_NEW', (data) => {
      console.log('CONFIGS_NEW')
      if (!$store.getters.configs[data.name]) {
        $store.dispatch('updateConfigDb', Object.assign({}, data, {'__socket': socket }))
      } else {
        $store.dispatch('notifyDialogErr', Object.assign({}, data, { err: `config with name '${data.name}' already exists.`}, {'__socket': socket }))
      }
    })
    socket.on('CONFIGS_DELETE', (data) => {
      console.log('CONFIGS_DELETE')
      $store.dispatch('removeConfigDb', Object.assign({}, data, {'__socket': socket }))
    })

    // build
    socket.on('GET_BUILD', (data) => {
      socket.emit('SOCKET_BUILD', $store.getters.build)
    })

    // integrations
    socket.on('GET_INTEGRATIONS', (data) => {
      socket.emit('SOCKET_INTEGRATIONS', $store.getters.integrations)
    })

    // integrations
    socket.on('GET_HOMELINKS', (data) => {
      socket.emit('SOCKET_HOMELINKS', $store.getters.homelinks)
    })

    // time sync
    socket.on('TIME_SYNC', (data) => {
      socket.emit('SOCKET_TIME_SYNC', { time: new Date().getTime() })
    })

    // run process
    socket.on('INTEGRATION_ACTION', (data) => {
      console.log('INTEGRATION_ACTION', data.action)
      $store.dispatch('integrationAction', Object.assign({}, data, {'__socket': socket }))
    })
  })
}
