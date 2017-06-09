import Vue from 'vue'
import Resource from 'vue-resource'
import NProgress from 'vue-nprogress'
import socketio from 'socket.io-client'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters'
import { TOGGLE_SIDEBAR } from 'vuex-store/mutation-types'
import lodash from 'lodash'
Object.defineProperty(Vue.prototype, '$lodash', { value: lodash })
const $socket = socketio({ transports: ['websocket', 'polling'] })
Object.defineProperty(Vue.prototype, '$socket', { value: $socket })

Vue.use(Resource)
Vue.use(NProgress)

// Enable devtools
Vue.config.devtools = true

sync(store, router)

const nprogress = new NProgress({ parent: '.nprogress-container' })

const { state } = store

router.beforeEach((route, redirect, next) => {
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(TOGGLE_SIDEBAR, false)
  }
  if (store.getters.auth.isAuth === false && window.location.hash.includes('admin')) {
    window.location.href = '/'
  }
  next()
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const app = new Vue({
  router,
  store,
  nprogress,
  ...App
})

export { app, router, store }
