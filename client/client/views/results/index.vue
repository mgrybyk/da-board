<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <template>
            <vue-fuse :keys="searchKeysResult" :list="results" :defaultAll="true" :shouldSort="false" eventName="fuseEvtResult"
              :findAllMatches="true" :threshold="0.3" :minMatchCharLength="2" :inputPlaceholder="'Search result...'" :inputClass="'input search-input'">
            </vue-fuse>
          </template>
          <template>
            <vue-fuse :keys="searchKeysConfig" :list="configs" :defaultAll="true" :shouldSort="false" eventName="fuseEvtConfig"
              :findAllMatches="true" :threshold="0.3" :minMatchCharLength="2" :inputPlaceholder="'Search config...'" :inputClass="'input search-input'">
            </vue-fuse>
          </template>
          <div class="table-responsive centered">
            <table class="table is-bordered is-striped is-narrow">
              <thead>
                <tr>
                  <th></th>
                  <th class="hide-column-small">BUILD</th>
                  <th>CONFIG</th>
                  <th colspan="2" class="hide-column-medium">OS</th>
                  <th colspan="2" class="hide-column-medium">DB</th>
                  <th class="hide-column-large">OS</th>
                  <th class="hide-column-large">DB</th>
                  <th>DATE</th>
                  <th class="hide-column-small">DUR.</th>
                  <th>T/P/F</th>
                </tr>
              </thead>
              <tbody>
                <TableItem
                  v-for="(item, key) in resultsAfterSearch || results"
                  :configs="configsObject"
                  :item="item"
                  :key="item._id"
                  :configSearchStarted="configSearchStarted">
                </TableItem>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Resource from 'vue-resource'
import { mapGetters, mapActions } from 'vuex'
import TableItem from './tableItem'
import VueFuse from 'vue-fuse'
Vue.use(VueFuse)

Vue.use(Resource)

const apiUrl = '/api/results'

export default {
  beforeMount () { this.clearResults() },

  data () {
    return {
      resultsAfterSearch: [],
      configsAfterSearch: [],
      searchKeysResult: ['name', 'integration', 'test.type', 'build.package', 'build.number'],
      searchKeysConfig: ['name', 'osNameExt', 'dbName', 'dbVersion', 'hostname'],
      configSearchStarted: false
    }
  },

  destroyed () { },

  computed: {
    ...mapGetters({
      results: 'results',
      resultsChanged: 'resultsChanged',
      configs: 'configs'
    }),
    configsObject () {
      let configs = {}
      let configsArray = (this.configsAfterSearch.length !== 0 && this.configsAfterSearch) || this.configs
      configsArray.forEach(element => {
        configs[element.name] = element
      })
      return configs
    }
  },

  methods: {
    ...mapActions([
      'resultsPush',
      'resultsClear',
      'resultsIsChanged'
    ]),
    getResults () {
      if (this.resultsChanged) {
        Vue.http.get(`${apiUrl}/1`).then(data => {
          this.resultsPush(data.body)

          Vue.http.get(`${apiUrl}/2`).then(data => this.resultsPush(data.body))
          Vue.http.get(`${apiUrl}/3`).then(data => this.resultsPush(data.body)).then(() => this.resultsIsChanged(false))
        })
      }
    },
    clearResults () {
      if (this.resultsChanged) { this.resultsClear() }
    }
  },

  components: { TableItem, VueFuse },

  mounted () {
    this.getResults()
    this.$on('fuseEvtResult', results => {
      this.resultsAfterSearch = results
    })
    this.$on('fuseEvtConfig', results => {
      if (!this.configSearchStarted && results.length !== 0 && results.length !== this.configs.length) {
        this.configSearchStarted = true
      }
      this.configsAfterSearch = results
    })
  },

  watch: {
    resultsChanged: function (val) {
      this.clearResults()
      this.getResults()
    }
  }
}
</script>

<style lang="scss">
  @media (max-width:680px)
  {
    .hide-column-small { display: none; }
  }

  @media (max-width:901px)
  {
    .hide-column-medium { display: none; }
  }

  @media (min-width:900px)
  {
    .hide-column-large { display: none; }
  }
</style>

<style lang="scss" scoped>

  input.search-input {
    margin: -8px 0 10px 0;
  }  

  @media (max-width:480px)
  {
    .table.is-narrow td, .table.is-narrow th {
      padding: .25em .35em;
    }
    .tile.is-ancestor {
      margin-left: -2rem;
      margin-right: -2rem;
      margin-top: -1rem;
    }
    .tile.is-parent {
      padding: 0;
    }
  }
</style>
