<template>
  <div>
    <button class="button is-info is-small top-control" @click="showModal=!showModal">New</button>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h1>Count {{ Object.keys(configs).length }}</h1>
          <div class="table-responsive">
            <table class="table is-bordered is-striped is-narrow">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Hostname</th>
                  <th></th>
                  <th>OS</th>
                  <th>DbName</th>
                  <th>DbVersion</th>
                  <th>Integration</th>
                  <th>Hide</th>
                </tr>
              </thead>
              <tbody>
                <TableItem
                  v-for="(item, key) in configs"
                  :item="item"
                  :baseModel="model"
                  :key="item._id">
                </TableItem>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </div>

    <ItemDialog :item="{}" :baseModel="model" :title="'New'" :socketEventName="'CONFIGS_NEW'" :openModal="showModal"></ItemDialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ItemDialog from '../../components/layout/ItemDialog'
import TableItem from './tableItem'

export default {
  components: { TableItem, ItemDialog },

  beforeMount () { },

  data () {
    return {
      showModal: false,
      itemFiltered: {},
      model: {
        name: { name: 'Name', isRequired: true },
        type: { name: 'Type' },
        hostname: { name: 'Hostname' },
        dbName: { name: 'Database Name' },
        dbVersion: { name: 'Database Version' },
        dbHostname: { name: 'Database Hostname' },
        osNameExt: { name: 'OS' },
        isNix: { name: 'Is Linux?', type: Boolean },
        browser: { name: 'Browser' },
        stages: { name: 'Stages (comma separated)', type: Array },
        links: { name: 'Links', type: Object },
        integration: { name: 'Integration', type: Object },
        disabled: { name: 'Is Disabled?', type: Boolean }
      }
    }
  },

  destroyed () { },

  computed: {
    ...mapGetters({
      configs: 'configs'
    })
  },

  methods: {
    openModalBasic () {
      this.showModal = true
    }
  },

  mounted () { }
}
</script>

<style lang="scss" scoped>
  .top-control {
    position: absolute;
    top: 20px;
    right: 140px;
  }
  @media (max-width:768px)
  {
    .top-control {
      right: 0;
    }
  }
</style>
