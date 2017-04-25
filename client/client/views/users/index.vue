<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="table-responsive centered">
            <table class="table is-bordered is-striped is-narrow">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Display Name</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <TableItem
                  v-for="(item, key) in users"
                  :item="item"
                  :auth="auth"
                  :baseModel="model"
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
import ItemDialog from '../../components/layout/ItemDialog'
import TableItem from './tableItem'

export default {
  components: { TableItem, ItemDialog },

  data () {
    return {
      showModal: false,
      model: {
        displayName: { name: 'Display Name', placeholder: 'Human readable name' }
      }
    }
  },

  computed: {
    ...mapGetters({
      users: 'users',
      auth: 'auth'
    })
  },

  methods: {
    openModalBasic () {
      this.showModal = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
