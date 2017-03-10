const pkg = state => state.pkg
const app = state => state.app
const device = state => state.app.device
const sidebar = state => state.app.sidebar
const effect = state => state.app.effect
const menuitems = state => state.menu.items
const results = state => state.results.data
const resultsChanged = state => state.results.changed
const tiles = state => state.tiles
const charts = state => state.charts.data
const configs = state => {
  let configsArr = []
  Object.keys(state.configs.data).forEach(key => {
    configsArr.push(state.configs.data[key])
  })
  configsArr.sort((a, b) => a.sortBy - b.sortBy)
  return configsArr
}
const configsEnabled = state => configs(state).filter(config => config.disabled !== true)
const buildPackage = state => state.build.package
const buildNumber = state => state.build.number
const timeDiff = state => state.timeDiff.timeDiff
const auth = state => state.auth
const componententry = state => {
  return state.menu.items.filter(c => c.meta && c.meta.label === 'Components')[0]
}

export {
  pkg,
  app,
  device,
  sidebar,
  effect,
  menuitems,
  results,
  resultsChanged,
  tiles,
  charts,
  configs,
  configsEnabled,
  buildPackage,
  buildNumber,
  timeDiff,
  auth,
  componententry
}
