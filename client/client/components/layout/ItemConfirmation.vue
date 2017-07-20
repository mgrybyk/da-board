<template>
  <div>
  <modal :visible="showModal" @close="closeModalBasic">
    <div class="box">
      <h1 class="title">Confirmation!</h1>

      <form v-on:submit.prevent="submit">
        <div class="block">
          <h4 class="title is-4">Are you sure you want to <strong>{{actionName}}</strong> <u>{{name}}</u></h4>

          <div class="block" v-if="dynamicProps">
            <div class="control" v-for="(row, key) in socketDataWrap">
              <label class="label">{{key}}</label>
              <p class="control">
                <textarea class="textarea" v-model="dynamicPropsModal[key]" v-if="row.type === 'textarea'"></textarea>
                <input class="input" type="text" v-model="dynamicPropsModal[key]" v-else>
              </p>
            </div>
          </div>

          <p class="control">
            <button class="button is-primary" type="submit">Yes</button>
            <button class="button is-link" @click="closeModalBasic" type="button">No</button>
          </p>
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
    return { showModal: false, dynamicPropsModal: {} }
  },

  components: { Modal },

  props: ['actionName', 'name', 'socketEventName', 'openConfirmation', 'dynamicProps'],

  methods: {
    openModalBasic () { this.showModal = true },
    closeModalBasic () { this.showModal = false },
    closeByEscape (ev) {
      if (this.showModal === true && ev.key === 'Escape') {
        this.closeModalBasic()
      }
    },
    submit () {
      this.$socket.emit(this.socketEventName, { actionName: this.actionName, name: this.name, dynamicProps: this.socketDataWrap })
      this.closeModalBasic()
    }
  },

  computed: {
    socketDataWrap () {
      if (!this.dynamicProps) return {}
      Object.keys(this.dynamicProps).forEach(key => {
        this.dynamicPropsModal[key] = this.dynamicProps[key].value
      })
      return this.dynamicProps
    }
  },

  watch: {
    openConfirmation (val) {
      this.openModalBasic()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
