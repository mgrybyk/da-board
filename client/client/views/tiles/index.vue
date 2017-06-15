<template>
  <div>
  <div class="top-control"><vb-switch v-model="dragEnabled" v-if="auth.isAuth">Sort</vb-switch></div>
  <template>
    <vue-fuse :keys="searchKeys" :list="configs" :defaultAll="true" :shouldSort="false" eventName="fuseEvt"
    :findAllMatches="true" :threshold="0.3" :inputPlaceholder="'Search...'" :inputClass="'input search-input'"></vue-fuse>
  </template>
  <div v-for="(integration, index) in integrationsWithNone" :key="integration._id">
    <h2 class="title" v-if="Object.keys(configsFiltered(integration.name)).length > 0">
      {{ integration.displayName || integration.name || 'No Integration' }} 
      (Latest build: {{ builds[integration.name] && builds[integration.name].package || 'N/A'}})
    </h2>
    <draggable :options="{ disabled: !dragEnabled || !auth.isAuth }" @start="drag=true" @end="onEnd.apply(this, [...arguments, integration.name])" class="my-tile-parent">
      <Tile
          v-for="(item, index) in configsFiltered(integration.name)"
          :timeDiff="timeDiff"
          :tile="tiles.data[item.name]"
          :config="item"
          :auth="auth"
          :integrations="integrations"
          :builds="builds"
          :key="item._id"
          @end="onEnd(this)">
        </Tile>
    </draggable>
  </div>

  </div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import Tile from './tile'
import VbSwitch from 'vue-checkbox-switch'
import VueFuse from 'vue-fuse'
Vue.use(VueFuse)

export default {
  components: { Tile, draggable, VbSwitch, VueFuse },

  beforeMount () { },

  data () {
    return {
      dragEnabled: false,
      configsAfterSearch: null,
      searchKeys: ['name', 'hostname', 'dbName', 'type', 'osNameExt']
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
      let filterArr = this.configsAfterSearch || this.configs
      return filterArr.filter(config => {
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
      integrations: 'integrations',
      builds: 'builds'
    }),
    integrationsWithNone () {
      return {...this.integrations, 'zzz': { name: undefined }}
    }
  },

  mounted () {
    this.$on('fuseEvt', results => {
      this.configsAfterSearch = results
    })
  }
}
</script>

<style lang="scss" scoped>
  div.my-tile-parent {
    display: flex;
    flex-wrap: wrap;
  }
</style>
