<template>
  <tr>
    <td class="is-icon has-link">
      <a @click="showModal=!showModal">
        <i class="fa fa-pencil"></i>
      </a>
    </td>
    <td><a :href="item.link">{{ item.name }}</a>
    <td>{{ item.details }}</td>
    <td>{{ item.group }}</td>
    <td class="is-icon has-link remove">
      <a @click="showConfirmation=!showConfirmation">
        <i class="fa fa-trash"></i>
      </a>
    </td>
    
  <ItemDialog :item="item" :baseModel="baseModel" :title="'Edit'" :socketEventName="'HOMELINKS_UPDATE_ONE'" :openModal="showModal"></ItemDialog>
  <ItemConfirmation :actionName="'delete'" :name="item.name" :socketEventName="'HOMELINKS_DELETE'" :openConfirmation="showConfirmation"></ItemConfirmation>
  
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

  props: ['item', 'baseModel']
}
</script>

<style lang="scss" scoped>
</style>
