<template>
  <div>
  <modal :visible="showModal" @close="closeModalBasic">
    <div class="box">
      <h1 class="title">{{title}}</h1>

      <div class="notification-container"></div>

      <form v-on:submit.prevent="submit">
        <div class="block">

          <div v-for="(row, key) in model">
            <label class="label">{{row.name}}</label>
            <p class="control">
              <textarea class="textarea" v-model="itemFiltered[key]" v-if="row.type === Object" :rows="row.rows || 2"></textarea>
              <input class="checkbox" type="checkbox" v-model="itemFiltered[key]" v-else-if="row.type === Boolean">
              <input class="input" type="text" v-model="itemFiltered[key]" :required="row.isRequired" v-else>
            </p>
          </div>

          <div class="block">            
            <p class="control">
              <button class="button is-primary" type="submit">Save</button>
              <button class="button is-link" @click="closeModalBasic" type="button">Cancel</button>
            </p>
          </div>

        </div>
      </form>

    </div>
  </modal>
  </div>
</template>

<script>
import { Modal } from 'vue-bulma-modal'

export default {
  created () {
    window.addEventListener('keyup', this.closeByEscape)
  },
  data () {
    return { showModal: false }
  },

  components: { Modal },

  props: ['item', 'baseModel', 'title', 'socketEventName', 'openModal'],

  methods: {
    openModalBasic () { this.showModal = true },
    closeModalBasic () { this.showModal = false },
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
        } else if (this.model[key].type === Object) {
          try {
            newItem[key] = JSON.parse(this.itemFiltered[key])
          } catch (err) {
            console.error(error)
            error = `Unable to parse JSON for field: ${this.model[key].name}`
          }
        } else if (this.itemFiltered[key].trim().length === 0) {
          newItem[key] = undefined
        } else if (this.model[key].type === Array) {
          newItem[key] = this.itemFiltered[key].split(',').map(x => x.trim())
        } else {
          newItem[key] = this.itemFiltered[key].trim()
        }

        if (this.model[key].isRequired && newItem[key] === undefined) {
          error = `Required field ${this.model[key].name} is empty!`
        }
      })
      if (error) return console.error(error)
      console.log(newItem)
      this.$socket.emit(this.socketEventName, newItem)
      this.closeModalBasic()
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
textarea.textarea {
  height: auto;
  min-height: 60px;
}
</style>
