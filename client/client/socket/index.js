import { mapActions } from 'vuex'

export default {
  beforeMount () {
    this.$options.sockets.SOCKET_CONFIGS = data => this.socketConfigs(data)
    this.$options.sockets.SOCKET_CONFIGS_UPDATE = data => this.socketConfigsUpdate(data)

    this.$options.sockets.SOCKET_CHART_INSTALLER = data => this.socketChartInstaller(data)
    this.$options.sockets.SOCKET_CHART_REST = data => this.socketChartRest(data)
    this.$options.sockets.SOCKET_CHART_UI = data => this.socketChartUI(data)

    this.$options.sockets.SOCKET_DASHBOARD = data => this.socketDasboard(data)

    this.$options.sockets.SOCKET_DASHBOARD_UPDATE_TILE = data => this.socketDasboardUpdateTile(data)

    this.$options.sockets.SOCKET_RESULTS_CHANGED = data => this.resultsIsChanged(true)

    this.$options.sockets.SOCKET_BUILD = data => this.socketBuild(data)

    this.$options.sockets.SOCKET_TIME_SYNC = data => this.timeSync(data.time - new Date().getTime())

    this.$options.sockets.connect = () => {
      this.$socket.emit('GET_CONFIGS')

      this.$socket.emit('GET_CHART_INSTALLER')
      this.$socket.emit('GET_CHART_REST')
      this.$socket.emit('GET_CHART_UI')

      this.$socket.emit('GET_DASHBOARD')

      this.$socket.emit('GET_BUILD')

      this.$socket.emit('TIME_SYNC')

      this.resultsIsChanged(true)
    }
  },

  destroyed () {
    delete this.$options.sockets.SOCKET_CONFIGS
    delete this.$options.sockets.SOCKET_CONFIGS_UPDATE

    delete this.$options.sockets.SOCKET_CHART_INSTALLER
    delete this.$options.sockets.SOCKET_CHART_REST
    delete this.$options.sockets.SOCKET_CHART_UI

    delete this.$options.sockets.SOCKET_DASHBOARD

    delete this.$options.sockets.SOCKET_DASHBOARD_UPDATE_TILE

    delete this.$options.sockets.SOCKET_RESULTS_CHANGED

    delete this.$options.sockets.SOCKET_BUILD

    delete this.$options.sockets.SOCKET_TIME_SYNC
  },

  methods: {
    ...mapActions([
      'socketConfigs',
      'socketConfigsUpdate',

      'socketChartUI',
      'socketChartRest',
      'socketChartInstaller',

      'socketDasboard',

      'socketDasboardUpdateTile',

      'resultsIsChanged',

      'socketBuild',

      'timeSync'
    ])
  },

  mounted () { }
}
