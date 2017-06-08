<template>
  <div>
  <modal :visible="showModal" @close="closeModalBasic">
    <div class="box">
      <h1 class="title">{{title}}</h1>

      <form v-on:submit.prevent="submit">
        <div class="block">
          <div class="control" v-for="(row, key) in model">
            <label class="label">{{row.name}}</label>
            <p class="control">
              <textarea class="textarea" :placeholder="row.placeholder" :title="row.title" v-model="itemFiltered[key]" v-if="row.type === Object" :rows="row.rows || 2"></textarea>
              <input class="checkbox" type="checkbox" :title="row.title" v-model="itemFiltered[key]" v-else-if="row.type === Boolean">
              <input class="input" :placeholder="row.placeholder" :title="row.title" type="text" v-model="itemFiltered[key]" :required="row.isRequired" v-else>
            </p>
          </div>
        </div>

        <div class="block">
          <div class="notification-container"></div>
        </div>

        <div class="block">
          <p class="control">
            <button class="button is-primary" type="submit">Save</button>
            <button class="button is-link" @click="closeModalBasic" type="button">Cancel</button>
          </p>
        </div>
      </form>

    </div>
  </modal>
  </div>
</template>

<script>
import { Modal } from 'vue-bulma-modal'
import Vue from 'vue'
import Notification from 'vue-bulma-notification'
import * as types from '../../store/mutation-types'

const NotificationComponent = Vue.extend(Notification)
const openNotificationInModal = propsData => {
  let container = document.querySelector('.modal .modal-content .box .notification-container')
  container.appendChild(document.createElement('div'))

  return new NotificationComponent({
    el: document.querySelector('.modal .modal-content .box .notification-container>div:last-child'),
    propsData
  })
}

const openNotificationInBody = propsData => new NotificationComponent({
  el: document.createElement('div'),
  propsData
})

export default {
  created () {
    window.addEventListener('keyup', this.closeByEscape)
  },
  data () {
    return { showModal: false }
  },

  components: { Modal, Notification },

  props: ['item', 'baseModel', 'title', 'socketEventName', 'openModal'],

  methods: {
    openModalBasic () {
      this.showModal = true
      this.$socket.on(types.SOCKET_DIALOG_ERROR, data => this.showDialogError(data))
      this.$socket.on(types.SOCKET_DIALOG_OK, data => this.showDialogOk(data))
    },
    closeModalBasic () {
      this.showModal = false
      delete this.$socket.off(types.SOCKET_DIALOG_ERROR)
      delete this.$socket.off(types.SOCKET_DIALOG_OK)
    },
    closeByEscape (ev) {
      if (this.showModal === true && ev.key === 'Escape') {
        this.closeModalBasic()
      }
    },
    submit () {
      let newItem = {...this.item}
      let error = null
      Object.keys(this.model).forEach(key => {
        if (this.itemFiltered[key] === null || this.itemFiltered[key] === undefined || this.model[key].type === Boolean) {
          newItem[key] = this.itemFiltered[key]
        } else if (this.itemFiltered[key].trim().length === 0) {
          newItem[key] = null
        } else if (this.model[key].type === Object) {
          try {
            newItem[key] = JSON.parse(this.itemFiltered[key])
          } catch (err) {
            error = `Unable to parse JSON for field: ${this.model[key].name}`
          }
        } else if (this.model[key].type === Array) {
          newItem[key] = this.itemFiltered[key].split(',').map(x => x.trim())
        } else {
          newItem[key] = this.itemFiltered[key].trim()
        }

        if (this.model[key].isRequired && newItem[key] === undefined) {
          error = `Required field ${this.model[key].name} is empty!`
        }
      })
      if (error) return this.showDialogError({ error })
      this.$socket.emit(this.socketEventName, newItem)
    },
    showDialogOk (data) {
      this.closeModalBasic()
      openNotificationInBody({
        title: 'Success!',
        message: `'${data.name}' successfully transitioned.`,
        type: 'success',
        direction: 'Right',
        duration: 3000
      })
    },
    showDialogError (data) {
      openNotificationInModal({
        title: 'Error!',
        message: data.error,
        type: 'danger',
        direction: 'Up',
        container: '*'
      })
    }
  },

  computed: {
    itemFiltered () {
      let newItem = {...this.item}
      Object.keys(newItem).forEach(key => {
        if (this.model[key] && this.model[key].type === Object) {
          newItem[key] = newItem[key] && JSON.stringify(newItem[key], null, 2)
          this.model[key].rows = newItem[key] && newItem[key].split(/\r\n|\r|\n/).length
        } else if (this.model[key] && this.model[key].type === Array) {
          newItem[key] = newItem[key] && newItem[key].join()
        }
      })
      return newItem
    },
    model () {
      let model = {}
      Object.keys(this.baseModel).forEach(key => {
        model[key] = {...this.baseModel[key]}
      })
      return model
    }
  },

  watch: {
    openModal (val) {
      this.openModalBasic()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
