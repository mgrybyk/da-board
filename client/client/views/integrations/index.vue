<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h1>Count {{ Object.keys(integrations).length }}</h1>
          <div class="table-responsive">
            <table class="table is-bordered is-striped is-narrow">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Root Url</th>
                </tr>
              </thead>
              <tbody>
                <TableItem
                  v-for="(item, key) in integrations"
                  :item="item"
                  :key="item._id">
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
      integrations: 'integrations'
    })
  },

  mounted () { }
}
</script>

<style lang="scss" scoped>
</style>
