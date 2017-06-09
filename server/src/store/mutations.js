const mutations = {
  updateConfig (state, config) {
    state.configs[config.name] = config
  },
  deleteConfig (state, name) {
    delete state.configs[name]
  },

  updateTile (state, entry) {
    state.tiles[entry.name] = entry
  },

  updateIntegration (state, entry) {
    state.integrations[entry.name] = entry
  },
  deleteIntegration (state, name) {
    delete state.integrations[name]
  },

  updateHomelink (state, entry) {
    state.homelinks[entry.name] = entry
  },
  deleteHomelink (state, name) {
    delete state.homelinks[name]
  },

  updateBuild (state, build) {
    state.builds[build.integration] = build
  },
  deleteBuild (state, integration) {
    delete state.builds[integration]
  }
}

module.exports = mutations
