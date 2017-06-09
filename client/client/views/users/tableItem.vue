<template>
  <tr>
    <td class="has-link" :class="(auth.username === item.username || auth.username === 'admin') && 'is-icon'">
      <a v-if="(auth.username === item.username || auth.username === 'admin')" @click="showModal=!showModal">
        <i class="fa fa-pencil"></i>
      </a>
    </td>
    <td>{{ item.username }}</td>
    <td>{{ item.displayName }}</td>
    <td class="has-link" :class="((auth.username === item.username) || auth.username === 'admin') && 'is-icon'">
      <a v-if="((auth.username === item.username) || auth.username === 'admin')" @click="showResetConfirmation=!showResetConfirmation">
        <i class="fa fa-key"></i>
      </a>
    </td>
    <td v-if="auth.username === 'admin'" class="has-link remove" :class="auth.username === 'admin' && 'is-icon'">
      <a @click="showDeleteConfirmation=!showDeleteConfirmation">
        <i class="fa fa-trash"></i>
      </a>
    </td>

  <ItemDialog :item="item" :baseModel="model" :title="'Edit'" :socketEventName="'USERS_UPDATE_ONE'" :openModal="showModal"></ItemDialog>
  <ItemConfirmation :actionName="'delete'" :name="item.username" :socketEventName="'USERS_DELETE'" :openConfirmation="showDeleteConfirmation"></ItemConfirmation>
  <ItemConfirmation :actionName="'reset password (to password) for'" :name="item.username" :socketEventName="'USERS_RESET'" :openConfirmation="showResetConfirmation"></ItemConfirmation>

  </tr>
</template>

<script>
import ItemDialog from '../../components/layout/ItemDialog'
import ItemConfirmation from '../../components/layout/ItemConfirmation'

export default {
  data () {
    return { showModal: false, showDeleteConfirmation: false, showResetConfirmation: false }
  },

  components: { ItemDialog, ItemConfirmation },

  props: ['item', 'baseModel', 'auth'],

  computed: {
    model () {
      if (this.auth.username !== this.item.username) return this.baseModel
      let model = Object.assign({}, this.baseModel)
      model.password = { name: 'Password', placeholder: 'at least 3 symbols!' }
      return model
    }
  }
}
</script>

<style lang="scss">

</style>
