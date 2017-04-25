<template>
<div>
  <a class="button is-link login" @click="logout" v-if="auth.isAuth">Sign Out</a>
  <a class="button is-info login" @click="openModalBasic" v-else>Sign In</a>

  <modal :visible="showModal" @close="closeModalBasic">
    <div class="box">
      <h1 class="title">Sign {{isSignIn ? "In" : "Up"}}</h1>

      <div class="notification-container"></div>

      <form v-on:submit.prevent="submit">
        <div class="block">
          <label class="label" v-show="!isSignIn">Name</label>
          <p class="control" v-show="!isSignIn">
            <input class="input" type="text" placeholder="Bill Gates" v-model="displayName">
          </p>
          <label class="label">Username</label>
          <p class="control">
            <input class="input" type="text" placeholder="bgates" v-model="username">
          </p>
          <label class="label">Password</label>
          <p class="control">
            <input class="input" type="password" placeholder="password" v-model="password">
          </p>

          <p class="control">
            <button class="button is-primary" type="submit">Submit</button>
            <button class="button is-link" v-if="isSignIn" @click="toggleSignIn" type="button">New user? Sign up!</button>
            <button class="button is-link" v-else @click="toggleSignIn" type="button">Have an account? Sign in</button>
          </p>
        </div>
      </form>

    </div>
  </modal>
</div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { Modal } from 'vue-bulma-modal'
import Notification from 'vue-bulma-notification'
import Resource from 'vue-resource'
Vue.use(Resource)

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
  components: {
    Modal
  },
  data () {
    return {
      showModal: false,
      isSignIn: true,

      username: '',
      password: '',
      displayName: ''
    }
  },
  methods: {
    ...mapActions([
      'setAuth'
    ]),
    openModalBasic () {
      this.showModal = true
    },
    closeModalBasic () {
      this.showModal = false
    },
    closeByEscape (ev) {
      if (this.showModal === true && ev.key === 'Escape') {
        this.closeModalBasic()
      }
    },
    toggleSignIn () {
      this.isSignIn = !this.isSignIn
    },
    submit () {
      if (!this.isSignIn) {
        Vue.http.post('api/signup', {
          username: this.username,
          password: this.password,
          displayName: this.displayName
        }).then(data => {
          if (data.body.success === true && data.body.user) {
            this.setAuth({ isAuth: true, username: data.body.user.username })
            this.closeModalBasic()
            this.showDisplayName(data.body.user.displayName)
          } else {
            this.showErrorNotification(data.body.message || 'Unknown Error')
          }
        })
      } else {
        Vue.http.post('api/signin', {
          username: this.username,
          password: this.password
        }).then(data => {
          if (data.body.success === true && data.body.user) {
            this.setAuth({ isAuth: true, username: data.body.user.username })
            this.closeModalBasic()
            this.showDisplayName(data.body.user.displayName)
          } else {
            this.showErrorNotification(data.body.message || 'Unknown Error')
          }
        })
      }
    },
    getAuth () {
      Vue.http.get('api/me').then(data => {
        if (data.body.success === true) {
          this.setAuth({ isAuth: true, username: data.body.user.username })
        } else {
          this.setAuth({ isAuth: false })
          if (window.location.hash.includes('admin')) {
            window.location.href = '/'
          }
        }
      })
    },
    logout () {
      Vue.http.post('api/logout').then(data => {
        this.getAuth()
      })
    },
    showDisplayName (displayName) {
      openNotificationInBody({
        title: 'Logged In',
        message: `Welcome, ${displayName}!`,
        type: 'success',
        direction: 'Right',
        duration: 3000
      })
    },
    showErrorNotification (message) {
      openNotificationInModal({
        title: 'Error',
        message: message,
        type: 'danger',
        direction: 'Up',
        container: '*'
      })
    }
  },

  computed: {
    ...mapGetters([
      'auth'
    ])
  },

  mounted () {
    this.getAuth()
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
