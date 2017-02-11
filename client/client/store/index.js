import Vue from 'vue'
import Vuex from 'vuex'
import pkg from 'package'
import * as actions from './actions'
import * as getters from './getters'

import app from './modules/app'
import results from './modules/results'
import dashboard from './modules/dashboard'
import homeCharts from './modules/homeCharts'
import configs from './modules/configs'
import build from './modules/build'
import menu from './modules/menu'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,  // process.env.NODE_ENV !== 'development',
  actions,
  getters,
  modules: {
    app,
    results,
    dashboard,
    homeCharts,
    configs,
    build,
    menu
  },
  state: {
    pkg
  },
  mutations: { }
})

export default store
