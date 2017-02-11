<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h1>Count {{ Object.keys(configs).length }}</h1>
          <div class="table-responsive">
            <table class="table is-bordered is-striped is-narrow">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Hostname</th>
                  <th>OS</th>
                  <th>DbName</th>
                  <th>DbVersion</th>
                  <th>Dur.</th>
                  <th>Nix</th>
                  <th>Hide</th>
                </tr>
              </thead>
              <tbody>
                <TableItem
                  v-for="(item, key) in configs"
                  v-bind:item="item">
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
import { mapGetters } from 'vuex'
import TableItem from './tableItem'

export default {
  components: { TableItem },

  beforeMount () { },

  data () {
    return { }
  },

  destroyed () { },

  computed: {
    ...mapGetters({
      configs: 'configs'
    })
  },

  mounted () { }
}
</script>

<style lang="scss">
</style>
