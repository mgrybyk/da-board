<template>
  <div>
  <vb-switch v-model="dragEnabled" v-if="auth.isAuth">Sort</vb-switch>
  <div v-for="(integration, index) in integrationsWithNone" :key="integration._id">
    <h2 class="title">{{ integration.name || 'No Integration' }}</h2>
    <draggable :options="{ disabled: !dragEnabled || !auth.isAuth }" @start="drag=true" @end="onEnd.apply(this, [...arguments, integration.name])" class="my-tile-parent">
      <Tile
          v-for="(item, index) in configsFiltered(integration.name)"
          :timeDiff="timeDiff"
          :tile="tiles.data[item.name]"
          :config="item"
          :auth="auth"
          :integrations="integrations"
          :key="item._id"
          @end="onEnd(this)">
        </Tile>
    </draggable>
  </div>

  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import Tile from './tile'
import VbSwitch from 'vue-checkbox-switch'

export default {
  components: { Tile, draggable, VbSwitch },

  beforeMount () { },

  data () {
    return {
      dragEnabled: false
    }
  },

  destroyed () { },

  methods: {
    ...mapActions([
      'configsUpdateSorting'
    ]),
    onEnd (evt, integrationName) {
      let configs = this.configsFiltered(integrationName)
      // no changes
      if (evt.newIndex === evt.oldIndex) return

      const step = 2048
      let sortBy = configs[evt.newIndex].sortBy
      let newSorting = 0

      if (evt.newIndex === 0) {
        // start
        newSorting = sortBy - step
      } else if (evt.newIndex === configs.length - 1) {
        // end
        newSorting = sortBy + step
      } else if (evt.newIndex > evt.oldIndex) {
        // after
        newSorting = (configs[evt.newIndex + 1].sortBy + sortBy) * 0.5
      } else if (evt.newIndex < evt.oldIndex) {
        // before
        newSorting = (configs[evt.newIndex - 1].sortBy + sortBy) * 0.5
      }

      let newConfig = { ...configs[evt.oldIndex], sortBy: newSorting }
      this.$socket.emit('CONFIGS_UPDATE_SORTING', newConfig)
      this.configsUpdateSorting(newConfig)
    },
    configsFiltered (integrationName) {
      return this.configs.filter(config => {
        if (integrationName === undefined) {
          return config.integration === integrationName
        }
        return config.integration && config.integration.name === integrationName
      })
    }
  },

  computed: {
    ...mapGetters({
      tiles: 'tiles',
      configs: 'configsEnabled',
      timeDiff: 'timeDiff',
      auth: 'auth',
      integrations: 'integrations'
    }),
    integrationsWithNone () {
      return {...this.integrations, 'zzz': { name: undefined }}
    }
  },

  mounted () { }
}
</script>

<style lang="scss" scoped>
  .switch {
    position: absolute;
    top: 20px;
    right: 140px;
  }
  div.my-tile-parent {
    display: flex;
    flex-wrap: wrap;
  }
  @media (max-width:768px)
  {
    .switch {
      right: 0;
    }
  }
</style>
