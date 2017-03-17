import Vue from 'vue'
import Vuex from 'vuex'
import pkg from 'package'
import * as actions from './actions'
import * as getters from './getters'

import app from './modules/app'
import results from './modules/results'
import tiles from './modules/tiles'
import integrations from './modules/integrations'
import charts from './modules/charts'
import configs from './modules/configs'
import build from './modules/build'
import timeDiff from './modules/timeDiff'
import auth from './modules/auth'
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
    charts,
    configs,
    build,
    timeDiff,
    auth,
    menu
  },
  state: {
    pkg
  },
  mutations: { }
})

export default store
