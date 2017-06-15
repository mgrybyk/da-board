<template>
  <tr :class="item.disabled && 'item-disabled'">
    <td class="is-icon has-link">
      <a @click="showModal=!showModal">
        <i class="fa fa-pencil"></i>
      </a>
    </td>
    <td>{{ item.name }}</td>
    <td>{{ item.type }}</td>
    <td>{{ item.hostname }}</td>
    <td class="is-icon"><i :class="'fa-' + (item.isNix ? 'linux' : 'windows')" class="fa"></i></td>
    <td>{{ item.osNameExt }}</td>
    <td>{{ item.dbName }}</td>
    <td>{{ item.dbVersion }}</td>
    <td>{{ item.integration && item.integration.name || 'None' }}</td>
    <td class="is-icon" :title="item.timestamp && new Date(item.timestamp).toLocaleString()">
      <i class="fa fa-clock-o timestamp"></i>
    </td>
    <td class="is-icon has-link">
      <a @click="showCopyModal=!showCopyModal" title="Copy">
        <i class="fa fa-copy"></i>
      </a>
    </td>
    <td class="is-icon has-link remove">
      <a @click="showConfirmation=!showConfirmation">
        <i class="fa fa-trash"></i>
      </a>
    </td>
    
  <ItemDialog :item="newItem(item)" :baseModel="baseModel" :title="'Copy'" :socketEventName="'CONFIGS_COPY'" :openModal="showCopyModal"></ItemDialog>
  <ItemDialog :item="item" :baseModel="baseModel" :title="'Edit'" :socketEventName="'CONFIGS_UPDATE_ONE'" :openModal="showModal"></ItemDialog>
  <ItemConfirmation :actionName="'delete'" :name="item.name" :socketEventName="'CONFIGS_DELETE'" :openConfirmation="showConfirmation"></ItemConfirmation>
  
  </tr>
</template>

<script>
import ItemDialog from '../../components/layout/ItemDialog'
import ItemConfirmation from '../../components/layout/ItemConfirmation'

export default {
  data () {
    return { showModal: false, showConfirmation: false, showCopyModal: false }
  },

  components: { ItemDialog, ItemConfirmation },

  props: ['item', 'baseModel'],

  methods: {
    newItem (item) {
      let newItem = this.$lodash.cloneDeep(item)
      delete newItem._id
      newItem.name += '-COPY'
      return newItem
    }
  },

  computed: { }
}
</script>

<style lang="scss" scoped>
tr.item-disabled {
  opacity: .5;
}
i.fa-windows {
  color: #19a0d0;
}
i.fa-linux {
  color: #5f5f00;
}
</style>
