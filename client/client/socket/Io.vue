<template></template>

<script>
import { mapActions } from 'vuex'

export default {
  beforeMount () {
    this.$options.sockets.SOCKET_CONFIGS = data => this.socketConfigs(data)
    this.$options.sockets.SOCKET_CONFIGS_UPDATE_ONE = data => this.socketConfigsUpdateOne(data)
    this.$options.sockets.SOCKET_CONFIGS_DELETE = data => this.socketConfigsDelete(data)

    this.$options.sockets.SOCKET_TILES = data => this.socketTiles(data)
    this.$options.sockets.SOCKET_TILES_UPDATE_ONE = data => this.socketTilesUpdateOne(data)

    this.$options.sockets.SOCKET_RESULTS_CHANGED = data => this.resultsIsChanged(true)

    this.$options.sockets.SOCKET_INTEGRATIONS = data => this.socketIntegrations(data)
    this.$options.sockets.SOCKET_INTEGRATIONS_UPDATE_ONE = data => this.socketIntegrationsUpdateOne(data)
    this.$options.sockets.SOCKET_INTEGRATIONS_DELETE = data => this.socketIntegrationsDelete(data)

    this.$options.sockets.SOCKET_HOMELINKS = data => this.socketHomeLinks(data)
    this.$options.sockets.SOCKET_HOMELINKS_UPDATE_ONE = data => this.socketHomeLinksUpdateOne(data)
    this.$options.sockets.SOCKET_HOMELINKS_DELETE = data => this.socketHomeLinksDelete(data)

    this.$options.sockets.SOCKET_BUILDS = data => this.socketBuilds(data)
    this.$options.sockets.SOCKET_BUILDS_UPDATE_ONE = data => this.socketBuildsUpdateOne(data)
    this.$options.sockets.SOCKET_BUILDS_DELETE = data => this.socketBuildsDelete(data)

    this.$options.sockets.SOCKET_USERS = data => this.socketUsers(data)
    this.$options.sockets.SOCKET_USERS_UPDATE_ONE = data => this.socketUsersUpdateOne(data)
    this.$options.sockets.SOCKET_USERS_DELETE = data => this.socketUsersDelete(data)

    this.$options.sockets.SOCKET_TIME_SYNC = data => this.timeSync(data.time - new Date().getTime())

    this.$options.sockets.connect = () => {
      this.$socket.emit('GET_CONFIGS')

      this.$socket.emit('GET_TILES')

      this.$socket.emit('GET_INTEGRATIONS')

      this.$socket.emit('GET_HOMELINKS')

      this.$socket.emit('GET_BUILDS')

      this.$socket.emit('GET_USERS')

      this.$socket.emit('TIME_SYNC')

      this.resultsIsChanged(true)
    }
  },

  destroyed () {
    delete this.$options.sockets.SOCKET_CONFIGS
    delete this.$options.sockets.SOCKET_CONFIGS_UPDATE_ONE
    delete this.$options.sockets.SOCKET_CONFIGS_DELETE

    delete this.$options.sockets.SOCKET_TILES
    delete this.$options.sockets.SOCKET_TILES_UPDATE_ONE

    delete this.$options.sockets.SOCKET_RESULTS_CHANGED

    delete this.$options.sockets.SOCKET_INTEGRATIONS
    delete this.$options.sockets.SOCKET_INTEGRATIONS_UPDATE_ONE
    delete this.$options.sockets.SOCKET_INTEGRATIONS_DELETE

    delete this.$options.sockets.SOCKET_HOMELINKS
    delete this.$options.sockets.SOCKET_HOMELINKS_UPDATE_ONE
    delete this.$options.sockets.SOCKET_HOMELINKS_DELETE

    delete this.$options.sockets.SOCKET_BUILDS
    delete this.$options.sockets.SOCKET_BUILDS_UPDATE_ONE
    delete this.$options.sockets.SOCKET_BUILDS_DELETE

    delete this.$options.sockets.SOCKET_USERS
    delete this.$options.sockets.SOCKET_USERS_UPDATE_ONE
    delete this.$options.sockets.SOCKET_USERS_DELETE

    delete this.$options.sockets.SOCKET_TIME_SYNC
  },

  methods: {
    ...mapActions([
      'socketConfigs',
      'socketConfigsUpdateOne',
      'socketConfigsDelete',

      'socketTiles',
      'socketTilesUpdateOne',

      'resultsIsChanged',

      'socketIntegrations',
      'socketIntegrationsUpdateOne',
      'socketIntegrationsDelete',

      'socketHomeLinks',
      'socketHomeLinksUpdateOne',
      'socketHomeLinksDelete',

      'socketUsers',
      'socketUsersUpdateOne',
      'socketUsersDelete',

      'socketBuilds',
      'socketBuildsUpdateOne',
      'socketBuildsDelete',

      'timeSync'
    ])
  }
}
</script>
