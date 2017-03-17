<template></template>

<script>
import { mapActions } from 'vuex'

export default {
  beforeMount () {
    this.$options.sockets.SOCKET_CONFIGS = data => this.socketConfigs(data)
    this.$options.sockets.SOCKET_CONFIGS_UPDATE_ONE = data => this.socketConfigsUpdateOne(data)

    this.$options.sockets.SOCKET_CHARTS_UPDATE_ONE = data => this.socketChartsUpdateOne(data)

    this.$options.sockets.SOCKET_TILES = data => this.socketTiles(data)
    this.$options.sockets.SOCKET_TILES_UPDATE_ONE = data => this.socketTilesUpdateOne(data)

    this.$options.sockets.SOCKET_RESULTS_CHANGED = data => this.resultsIsChanged(true)

    this.$options.sockets.SOCKET_BUILD = data => this.socketBuild(data)

    this.$options.sockets.SOCKET_INTEGRATIONS = data => this.socketIntegrations(data)

    this.$options.sockets.SOCKET_TIME_SYNC = data => this.timeSync(data.time - new Date().getTime())

    this.$options.sockets.connect = () => {
      this.$socket.emit('GET_CONFIGS')

      this.$socket.emit('GET_CHARTS')

      this.$socket.emit('GET_TILES')

      this.$socket.emit('GET_BUILD')

      this.$socket.emit('GET_INTEGRATIONS')

      this.$socket.emit('TIME_SYNC')

      this.resultsIsChanged(true)
    }
  },

  destroyed () {
    delete this.$options.sockets.SOCKET_CONFIGS
    delete this.$options.sockets.SOCKET_CONFIGS_UPDATE_ONE

    delete this.$options.sockets.SOCKET_CHARTS_UPDATE_ONE

    delete this.$options.sockets.SOCKET_TILES
    delete this.$options.sockets.SOCKET_TILES_UPDATE_ONE

    delete this.$options.sockets.SOCKET_RESULTS_CHANGED

    delete this.$options.sockets.SOCKET_BUILD

    delete this.$options.sockets.SOCKET_INTEGRATIONS

    delete this.$options.sockets.SOCKET_TIME_SYNC
  },

  methods: {
    ...mapActions([
      'socketConfigs',
      'socketConfigsUpdateOne',

      'socketCharts',
      'socketChartsUpdateOne',

      'socketTiles',
      'socketTilesUpdateOne',

      'resultsIsChanged',

      'socketBuild',

      'socketIntegrations',

      'timeSync'
    ])
  }
}
</script>
