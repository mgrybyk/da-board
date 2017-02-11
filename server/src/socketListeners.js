'use strict'

module.exports = io => {
  io.on('connection', function (socket) {
    console.log('a user connected')

    // charts
    socket.on('GET_CHART_INSTALLER', (data) => {
      console.log('GET_CHART_INSTALLER')
      socket.emit('SOCKET_CHART_INSTALLER', $store.getters.chart_installer)
    })
    socket.on('GET_CHART_REST', (data) => {
      console.log('GET_CHART_REST')
      socket.emit('SOCKET_CHART_REST', $store.getters.chart_rest)
    })
    socket.on('GET_CHART_UI', (data) => {
      console.log('GET_CHART_UI')
      socket.emit('SOCKET_CHART_UI', $store.getters.chart_ui)
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
  })
}
