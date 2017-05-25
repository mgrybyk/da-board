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

// Tiles

export const socketTiles = ({ commit }, data) => {
  commit(types.SOCKET_TILES, data)
}

export const socketTilesUpdateOne = ({ commit }, tile) => {
  commit(types.SOCKET_TILES_UPDATE_ONE, tile)
}

// Integrations

export const socketIntegrations = ({ commit }, data) => {
  commit(types.SOCKET_INTEGRATIONS, data)
}

export const socketIntegrationsUpdateOne = ({ commit }, integration) => {
  commit(types.SOCKET_INTEGRATIONS_UPDATE_ONE, integration)
}

export const socketIntegrationsDelete = ({ commit }, integration) => {
  commit(types.SOCKET_INTEGRATIONS_DELETE, integration)
}

// Home Links

export const socketHomeLinks = ({ commit }, data) => {
  commit(types.SOCKET_HOMELINKS, data)
}

export const socketHomeLinksUpdateOne = ({ commit }, homeLink) => {
  commit(types.SOCKET_HOMELINKS_UPDATE_ONE, homeLink)
}

export const socketHomeLinksDelete = ({ commit }, homeLink) => {
  commit(types.SOCKET_HOMELINKS_DELETE, homeLink)
}

// Users

export const socketUsers = ({ commit }, data) => {
  commit(types.SOCKET_USERS, data)
}

export const socketUsersUpdateOne = ({ commit }, user) => {
  commit(types.SOCKET_USERS_UPDATE_ONE, user)
}

export const socketUsersDelete = ({ commit }, user) => {
  commit(types.SOCKET_USERS_DELETE, user)
}

// Builds

export const socketBuilds = ({ commit }, data) => {
  commit(types.SOCKET_BUILDS, data)
}

export const socketBuildsUpdateOne = ({ commit }, build) => {
  commit(types.SOCKET_BUILDS_UPDATE_ONE, build)
}

export const socketBuildsDelete = ({ commit }, build) => {
  commit(types.SOCKET_BUILDS_DELETE, build)
}

// Configs

export const socketConfigs = ({ commit }, data) => {
  commit(types.SOCKET_CONFIGS, data)
}

export const socketConfigsUpdateOne = ({ commit }, config) => {
  commit(types.SOCKET_CONFIGS_UPDATE_ONE, config)
}

export const socketConfigsDelete = ({ commit }, config) => {
  commit(types.SOCKET_CONFIGS_DELETE, config)
}

export const configsUpdateSorting = ({ commit }, tile) => {
  commit(types.CONFIGS_UPDATE_SORTING, tile)
}

// Time sync

export const timeSync = ({ commit }, diff) => {
  commit(types.SOCKET_TIME_SYNC, diff)
}

// Auth

export const setAuth = ({ commit }, data) => {
  commit(types.SET_AUTH, data)
}
