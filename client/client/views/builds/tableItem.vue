<template>
  <tr>
    <td class="is-icon has-link">
      <a @click="showModal=!showModal">
        <i class="fa fa-pencil"></i>
      </a>
    </td>
    <td>{{ item.integration }}</td>
    <td>{{ item.package }}</td>
    <td class="is-icon" :title="item.timestamp && new Date(item.timestamp).toLocaleString()">
      <i class="fa fa-clock-o timestamp"></i>
    </td>
    <td class="is-icon has-link remove">
      <a @click="showConfirmation=!showConfirmation">
        <i class="fa fa-trash"></i>
      </a>
    </td>

  <ItemDialog :item="item" :baseModel="baseModel" :title="'Edit'" :socketEventName="'BUILDS_UPDATE_ONE'" :openModal="showModal" :propName="'integration'"></ItemDialog>
  <ItemConfirmation :actionName="'delete build for'" :name="item.integration" :socketEventName="'BUILDS_DELETE'" :openConfirmation="showConfirmation"></ItemConfirmation>

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
  }
}
</script>

<style lang="scss">

</style>
