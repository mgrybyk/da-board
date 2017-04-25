<template>
  <div>
  <div class="top-control"><button class="button is-info is-smaller" @click="showModal=!showModal">New</button></div>
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
                  <th>Is Chart</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <TableItem
                  v-for="(item, key) in stages"
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

    <ItemDialog :item="{}" :baseModel="model" :title="'New'" :socketEventName="'STAGES_NEW'" :openModal="showModal"></ItemDialog>

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
        name: { name: 'Name', isRequired: true, placeholder: 'Unique name' },
        displayName: { name: 'Display Name', placeholder: 'Human readable name' },
        isChart: { name: 'Is Chart', type: Boolean }
      }
    }
  },

  computed: {
    ...mapGetters({
      stages: 'stages'
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
