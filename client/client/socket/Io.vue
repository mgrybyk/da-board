<template></template>

<script>
import { mapActions } from 'vuex'
import * as types from '../store/mutation-types'

export default {
  beforeMount () {
    this.$socket.on(types.SOCKET_CONFIGS, data => this.socketConfigs(data))
    this.$socket.on(types.SOCKET_CONFIGS, data => this.socketConfigs(data))
    this.$socket.on(types.SOCKET_CONFIGS_UPDATE_ONE, data => this.socketConfigsUpdateOne(data))
    this.$socket.on(types.SOCKET_CONFIGS_DELETE, data => this.socketConfigsDelete(data))

    this.$socket.on(types.SOCKET_TILES, data => this.socketTiles(data))
    this.$socket.on(types.SOCKET_TILES_UPDATE_ONE, data => this.socketTilesUpdateOne(data))

    this.$socket.on(types.SOCKET_RESULTS_CHANGED, data => this.resultsIsChanged(true))

    this.$socket.on(types.SOCKET_INTEGRATIONS, data => this.socketIntegrations(data))
    this.$socket.on(types.SOCKET_INTEGRATIONS_UPDATE_ONE, data => this.socketIntegrationsUpdateOne(data))
    this.$socket.on(types.SOCKET_INTEGRATIONS_DELETE, data => this.socketIntegrationsDelete(data))

    this.$socket.on(types.SOCKET_HOMELINKS, data => this.socketHomeLinks(data))
    this.$socket.on(types.SOCKET_HOMELINKS_UPDATE_ONE, data => this.socketHomeLinksUpdateOne(data))
    this.$socket.on(types.SOCKET_HOMELINKS_DELETE, data => this.socketHomeLinksDelete(data))

    this.$socket.on(types.SOCKET_BUILDS, data => this.socketBuilds(data))
    this.$socket.on(types.SOCKET_BUILDS_UPDATE_ONE, data => this.socketBuildsUpdateOne(data))
    this.$socket.on(types.SOCKET_BUILDS_DELETE, data => this.socketBuildsDelete(data))

    this.$socket.on(types.SOCKET_USERS, data => this.socketUsers(data))
    this.$socket.on(types.SOCKET_USERS_UPDATE_ONE, data => this.socketUsersUpdateOne(data))
    this.$socket.on(types.SOCKET_USERS_DELETE, data => this.socketUsersDelete(data))

    this.$socket.on(types.SOCKET_TIME_SYNC, data => this.timeSync(data.time - new Date().getTime()))
  },

  destroyed () {
    delete this.$socket.off(types.SOCKET_CONFIGS)
    delete this.$socket.off(types.SOCKET_CONFIGS_UPDATE_ONE)
    delete this.$socket.off(types.SOCKET_CONFIGS_DELETE)

    delete this.$socket.off(types.SOCKET_TILES)
    delete this.$socket.off(types.SOCKET_TILES_UPDATE_ONE)

    delete this.$socket.off(types.SOCKET_RESULTS_CHANGED)

    delete this.$socket.off(types.SOCKET_INTEGRATIONS)
    delete this.$socket.off(types.SOCKET_INTEGRATIONS_UPDATE_ONE)
    delete this.$socket.off(types.SOCKET_INTEGRATIONS_DELETE)

    delete this.$socket.off(types.SOCKET_HOMELINKS)
    delete this.$socket.off(types.SOCKET_HOMELINKS_UPDATE_ONE)
    delete this.$socket.off(types.SOCKET_HOMELINKS_DELETE)

    delete this.$socket.off(types.SOCKET_BUILDS)
    delete this.$socket.off(types.SOCKET_BUILDS_UPDATE_ONE)
    delete this.$socket.off(types.SOCKET_BUILDS_DELETE)

    delete this.$socket.off(types.SOCKET_USERS)
    delete this.$socket.off(types.SOCKET_USERS_UPDATE_ONE)
    delete this.$socket.off(types.SOCKET_USERS_DELETE)

    delete this.$socket.off(types.SOCKET_TIME_SYNC)
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
  },

  mounted () {
    this.$socket.on('connect', () => {
      this.$socket.emit('GET_CONFIGS')

      this.$socket.emit('GET_TILES')

      this.$socket.emit('GET_INTEGRATIONS')

      this.$socket.emit('GET_HOMELINKS')

      this.$socket.emit('GET_BUILDS')

      this.$socket.emit('GET_USERS')

      this.$socket.emit('TIME_SYNC')

      this.resultsIsChanged(true)
    })
  }
}
</script>
