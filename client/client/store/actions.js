import * as types from './mutation-types'

export const toggleSidebar = ({ commit }, opened) => commit(types.TOGGLE_SIDEBAR, opened)

export const toggleDevice = ({ commit }, device) => commit(types.TOGGLE_DEVICE, device)

export const expandMenu = ({ commit }, menuItem) => {
  if (menuItem) {
    menuItem.expanded = menuItem.expanded || false
    commit(types.EXPAND_MENU, menuItem)
  }
}

export const switchEffect = ({ commit }, effectItem) => {
  if (effectItem) {
    commit(types.SWITCH_EFFECT, effectItem)
  }
}

// Results

export const resultsPush = ({ commit }, data) => {
  commit(types.RESULTS_PUSH, data)
}

export const resultsClear = ({ commit }) => {
  commit(types.RESULTS_CLEAR)
}

export const resultsIsChanged = ({ commit }, changed) => {
  commit(types.RESULTS_CHANGED, changed)
}

// Dashboard

export const socketDasboard = ({ commit }, data) => {
  commit(types.SOCKET_DASHBOARD, data)
}

export const socketDasboardUpdateTile = ({ commit }, tile) => {
  commit(types.SOCKET_DASHBOARD_UPDATE_TILE, tile)
}

// Home Charts

export const socketChartUI = ({ commit }, data) => {
  commit(types.SOCKET_CHART_UI_CHANGED, true)
  setTimeout(() => { commit(types.SOCKET_CHART_UI, data) }, 200)
  setTimeout(() => { commit(types.SOCKET_CHART_UI_CHANGED, false) }, 300)
}

export const socketChartRest = ({ commit }, data) => {
  commit(types.SOCKET_CHART_REST_CHANGED, true)
  setTimeout(() => { commit(types.SOCKET_CHART_REST, data) }, 200)
  setTimeout(() => { commit(types.SOCKET_CHART_REST_CHANGED, false) }, 300)
}

export const socketChartInstaller = ({ commit }, data) => {
  commit(types.SOCKET_CHART_INSTALLER_CHANGED, true)
  setTimeout(() => { commit(types.SOCKET_CHART_INSTALLER, data) }, 200)
  setTimeout(() => { commit(types.SOCKET_CHART_INSTALLER_CHANGED, false) }, 300)
}

// Configs

export const socketConfigs = ({ commit }, data) => {
  commit(types.SOCKET_CONFIGS, data)
}

export const socketConfigsUpdate = ({ commit }, config) => {
  commit(types.SOCKET_CONFIGS_UPDATE, config)
}

// Build

export const socketBuild = ({ commit }, build) => {
  commit(types.SOCKET_BUILD, build)
}
