<template>
  <div>
    <div class="top-control">
      <vb-switch v-model="signupAllowedChanged" :checked="settings.signup_allowed && settings.signup_allowed.flag">Signup Allowed</vb-switch>
    </div>
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
                  <th v-if="auth.username === 'admin'"></th>
                </tr>
              </thead>
              <tbody>
                <TableItem v-for="(item, key) in users" :item="item" :auth="auth" :baseModel="model" :key="item._id">
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
  import VbSwitch from 'vue-checkbox-switch'

  export default {
    components: { TableItem, ItemDialog, VbSwitch },

    data () {
      return {
        showModal: false,
        signupAllowedChanged: null,
        model: {
          displayName: { name: 'Display Name', placeholder: 'Human readable name' }
        }
      }
    },

    computed: {
      ...mapGetters({
        users: 'users',
        auth: 'auth',
        settings: 'settings'
      })
    },

    watch: {
      signupAllowedChanged (val) {
        let item = Object.assign({}, this.settings.signup_allowed) || {}
        if (item.flag === val) return
        item.flag = val
        this.$socket.emit('SETTINGS_UPDATE_ONE', item)
      }
    }
  }

</script>

<style lang="scss" scoped>

</style>
