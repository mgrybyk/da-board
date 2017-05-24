<template>
  <div>
    <div class="top-control"><button class="button is-info is-smaller" @click="showModal=!showModal">New</button></div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="table-responsive">
            <table class="table is-bordered is-striped is-narrow">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Details</th>
                  <th>Group</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <TableItem
                  v-for="(item, key) in homeLinks"
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

    <ItemDialog :item="{}" :baseModel="model" :title="'New'" :socketEventName="'HOMELINKS_NEW'" :openModal="showModal"></ItemDialog>

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
        name: { name: 'Name', isRequired: true, placeholder: 'google' },
        link: { name: 'Link', placeholder: 'https://google.com' },
        details: { name: 'Details', placeholder: 'Google search engine!' },
        group: { name: 'Group', placeholder: 'Some value you want to group links by..' }
      }
    }
  },

  computed: {
    ...mapGetters({
      homeLinks: 'homeLinks'
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
  @media (max-width:768px)
  {
    .top-control {
      right: 0;
    }
  }
</style>
