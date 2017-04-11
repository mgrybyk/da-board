<template>
  <div>
  <modal :visible="showModal" @close="closeModalBasic">
    <div class="box">
      <h1 class="title">Confirmation!</h1>

      <form v-on:submit.prevent="submit">
        <div class="block">
          <h4 class="title is-4">Are you sure you want to <strong>{{actionName}}</strong> <u>{{name}}</u></h4>

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
    return { showModal: false }
  },

  components: { Modal },

  props: ['actionName', 'name', 'socketEventName', 'openConfirmation'],

  methods: {
    openModalBasic () { this.showModal = true },
    closeModalBasic () { this.showModal = false },
    closeByEscape (ev) {
      if (this.showModal === true && ev.key === 'Escape') {
        this.closeModalBasic()
      }
    },
    submit () {
      this.$socket.emit(this.socketEventName, { actionName: this.actionName, name: this.name })
      this.closeModalBasic()
    }
  },

  computed: {
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
