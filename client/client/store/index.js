import Vue from 'vue'
import Vuex from 'vuex'
import pkg from 'package'
import * as actions from './actions'
import * as getters from './getters'

import app from './modules/app'
import results from './modules/results'
import tiles from './modules/tiles'
import integrations from './modules/integrations'
import configs from './modules/configs'
import timeDiff from './modules/timeDiff'
import auth from './modules/auth'
import homeLinks from './modules/homeLinks'
import builds from './modules/builds'
import users from './modules/users'
import menu from './modules/menu'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,  // process.env.NODE_ENV !== 'production',
  actions,
  getters,
  modules: {
    app,
    results,
    tiles,
    integrations,
    configs,
    timeDiff,
    auth,
    homeLinks,
    builds,
    users,
    menu
  },
  state: {
    pkg
  },
  mutations: { }
})

export default store
