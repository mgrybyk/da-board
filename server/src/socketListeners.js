'use strict'

module.exports = io => {
  io.on('connection', function (socket) {
    console.log('a user connected')

    // charts
    socket.on('GET_CHARTS', (data) => {
      console.log('GET_CHARTS')
      Object.keys($store.getters.charts).forEach(key => {
        let chart = $store.getters.charts[key]
        if (chart.data) {
          socket.emit('SOCKET_CHART', chart)
        }
      })
    })

    // dashboard
    socket.on('GET_DASHBOARD', (data) => {
      console.log('GET_DASHBOARD')
      socket.emit('SOCKET_DASHBOARD', $store.getters.dashboard)
    })

    // configs
    socket.on('GET_CONFIGS', (data) => {
      console.log('GET_CONFIGS')
      socket.emit('SOCKET_CONFIGS', $store.getters.configs)
    })

    // build
    socket.on('GET_BUILD', (data) => {
      socket.emit('SOCKET_BUILD', $store.getters.build)
    })

    // time sync
    socket.on('TIME_SYNC', (data) => {
      socket.emit('SOCKET_TIME_SYNC', { time: new Date().getTime() })
    })

    // run process
    socket.on('RUN_PROCESS', (data) => {
      console.log('RUN_PROCESS')
    })
  })
}
