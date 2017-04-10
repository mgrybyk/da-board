<template>
  <tr>
    <td class="is-icon">
      <a>
        <i class="fa fa-pencil" @click="showModal=!showModal"></i>
      </a>
    </td>
    <td>{{ item.name }}</td>
    <td>{{ item.type }}</td>
    <td>{{ item.hostname }}</td>
    <td><i :class="'fa-' + (item.isNix ? 'linux' : 'windows')" class="fa"></i></td>
    <td>{{ item.osNameExt }}</td>
    <td>{{ item.dbName }}</td>
    <td>{{ item.dbVersion }}</td>
    <td>{{ item.integration && item.integration.name || 'None' }}</td>
    <td>{{ item.disabled }}</td>
    
  <ItemDialog :item="item" :baseModel="baseModel" :title="'Edit'" :socketEventName="'CONFIGS_UPDATE_ONE'" :openModal="showModal"></ItemDialog>
  
  </tr>
</template>

<script>
import ItemDialog from '../../components/layout/ItemDialog'

export default {
  data () {
    return { showModal: false }
  },

  components: { ItemDialog },

  props: ['item', 'baseModel'],

  methods: { },

  computed: { }
}
</script>

<style lang="scss" scoped>
textarea.textarea {
  height: auto;
  min-height: 60px;
}
</style>
