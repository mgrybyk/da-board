<template>
<div>
  <a class="button is-link login" @click="logout" v-if="isAuth">Sign Out</a>
  <a class="button is-info login" @click="openModalBasic" v-else>Sign In</a>

  <modal :visible="showModal" @close="closeModalBasic">
    <div class="box">
      <h1 class="title">Sign {{isSignIn ? "In" : "Up"}}</h1>

      <div class="notification-container"></div>

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
          <button class="button is-primary" @click="submit">Submit</button>
          <button class="button is-link" v-if="isSignIn" @click="toggleSignIn">New user? Sign up!</button>
          <button class="button is-link" v-else @click="toggleSignIn">Already have an account? Sign in</button>
        </p>
      </div>

    </div>
  </modal>
</div>
</template>

<script>
import Vue from 'vue'
import { Modal } from 'vue-bulma-modal'
import Notification from 'vue-bulma-notification'
import Resource from 'vue-resource'
Vue.use(Resource)

const NotificationComponent = Vue.extend(Notification)
const openNotification = propsData => {
  let container = document.querySelector('.modal .modal-content .box .notification-container')
  container.appendChild(document.createElement('div'))

  return new NotificationComponent({
    el: document.querySelector('.modal .modal-content .box .notification-container>div:last-child'),
    propsData
  })
}

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
      displayName: '',
      isAuth: false
    }
  },
  methods: {
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
          if (data.body.success === true) {
            this.isAuth = true
            this.getAuth()
          }
          console.log(data)
        })
      } else {
        Vue.http.post('api/signin', {
          username: this.username,
          password: this.password
        }).then(data => {
          if (data.body.success === true) {
            this.isAuth = true
            this.getAuth()
          }
          console.log(data)
        })
      }
      openNotification({
        title: 'Error',
        message: '',
        type: 'danger',
        direction: 'Left',
        container: '*'
      })
    },
    getAuth () {
      Vue.http.get('api/me').then(data => {
        if (data.body.success === true) {
          this.isAuth = true
        } else {
          this.isAuth = false
        }
      })
    },
    logout () {
      Vue.http.post('api/logout').then(data => {
        this.getAuth()
      })
    }
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
  div.box {
    transition: height 1s;
  }
  
</style>
