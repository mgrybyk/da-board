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
                  <th>Root Url</th>
                  <th>Auth</th>
                  <th>Actions</th>
                  <th>Remote Calls</th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <TableItem
                  v-for="(item, key) in integrations"
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

    <ItemDialog :item="{}" :baseModel="model" :title="'New'" :socketEventName="'INTEGRATIONS_NEW'" :openModal="showModal"></ItemDialog>

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
        rootUrl: { name: 'Root url', placeholder: 'http://jenkins:8080' },
        processUrlTemplate: { name: 'Process Url Template', placeholder: '{{rootUrl}}/job/{{JOB_NAME}}/{{processId}}', title: 'Use root url, process id, and props defined in actions' },
        auth: {
          name: 'Credential',
          type: Object,
          placeholder: '{ "user": "service_user", "pass": "password" }',
          title: 'Only HTTP Auth supported or no auth are supported'
        },
        actions: {
          name: 'Actions',
          type: Object,
          placeholder: `{ "run": { "urlTemplate": "{{rootUrl}}/job/{{JOB_NAME}}/buildWithParameters",
 "method": "post", "headers": {} } }`,
          title: 'Each action accepts urlTemplate, body and method; urlTemplate and body support variables'
        },
        headers: {
          name: 'Headers',
          type: Object,
          placeholder: '{ "content-type": "application/json" }',
          title: 'Request headers applicable for every action.'
        },
        remote: {
          name: 'Remote Calls',
          type: Object,
          placeholder: '{ "run": { "urlTemplate": "{{rootUrl}}/rest/deploy/applicationProcessRequest/{{requestId}}/properties" } }',
          title: 'Some integrations may require calls to be made to remote system. Please contact a particular developer or integration for details.'
        }
      }
    }
  },

  computed: {
    ...mapGetters({
      integrations: 'integrations'
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
