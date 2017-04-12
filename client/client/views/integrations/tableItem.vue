<template>
  <tr>
    <td class="is-icon has-link">
      <a @click="showModal=!showModal">
        <i class="fa fa-pencil"></i>
      </a>
    </td>
    <td>{{ item.name }}</td>
    <td>{{ item.displayName }}</td>
    <td>{{ item.rootUrl }}</td>
    <td>{{ item.auth && item.auth.user || 'None' }}</td>
    <td>{{ joinKeys(item.actions) }}</td>
    <td>{{ joinKeys(item.remote) }}</td>
    <td class="is-icon has-link remove">
      <a @click="showConfirmation=!showConfirmation">
        <i class="fa fa-trash"></i>
      </a>
    </td>

  <ItemDialog :item="item" :baseModel="baseModel" :title="'Edit'" :socketEventName="'INTEGRATIONS_UPDATE_ONE'" :openModal="showModal"></ItemDialog>
  <ItemConfirmation :actionName="'delete'" :name="item.name" :socketEventName="'INTEGRATIONS_DELETE'" :openConfirmation="showConfirmation"></ItemConfirmation>

  </tr>
</template>

<script>
import ItemDialog from '../../components/layout/ItemDialog'
import ItemConfirmation from '../../components/layout/ItemConfirmation'

export default {
  data () {
    return { showModal: false, showConfirmation: false }
  },

  components: { ItemDialog, ItemConfirmation },

  props: ['item', 'baseModel'],

  methods: {
    joinKeys (obj) {
      return (obj && Object.keys(obj).join(', ')) || 'None'
    }
  }
}
</script>

<style lang="scss">

</style>
