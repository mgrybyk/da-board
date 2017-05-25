<template></template>

<script>
import Vue from 'vue'
import Notification from 'vue-bulma-notification'

const NotificationComponent = Vue.extend(Notification)

const openNotificationInBody = propsData => new NotificationComponent({
  el: document.createElement('div'),
  propsData
})

export default {
  beforeMount () {
    this.$options.sockets.SOCKET_INTEGRATION_ACTION_RESULT = data => this.showIntegrationActionResult(data)
    this.$options.sockets.SOCKET_DELETE_ERROR = data => this.showDeleteError(data)
    this.$options.sockets.SOCKET_DELETE_OK = data => this.showDeleteOk(data)
  },
  destroyed () {
    delete this.$options.sockets.SOCKET_INTEGRATION_ACTION_RESULT
    delete this.$options.sockets.SOCKET_DELETE_ERROR
    delete this.$options.sockets.SOCKET_DELETE_OK
  },
  components: { },
  data () {
    return { }
  },
  methods: {
    showIntegrationActionResult (data) {
      let msg = {
        title: `${data.actionName} ${data.configName}`,
        direction: 'Right'
      }
      if (data.isError) {
        msg.title = 'Failed to ' + msg.title
        msg.type = 'danger'
        msg.message = `Error: ${data.error}`
        msg.duration = 30000
      } else {
        msg.title = 'Succeeded to ' + msg.title
        msg.type = 'info'
        msg.message = 'Success!'
      }
      openNotificationInBody(msg)
    },
    showDeleteError (data) {
      openNotificationInBody({
        title: 'Failed to delete ' + data.name,
        message: `Error: ${data.error}`,
        type: 'danger',
        direction: 'Right',
        duration: 10000
      })
    },
    showDeleteOk (data) {
      openNotificationInBody({
        title: 'Success!',
        message: `${data.name} was deleted.`,
        type: 'info',
        direction: 'Right'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  a.login {
    vertical-align: middle;
  }
  h1.title {
    margin-bottom: 1rem;
  }
</style>
<style lang="scss">
  .modal-content {
    max-height: calc(100vh - 60px);
    margin: 0 35px 0 -15px;
  }
  @media (max-width:480px)
  {
    button.modal-close {
      right: 0;
    }
  }
</style>
