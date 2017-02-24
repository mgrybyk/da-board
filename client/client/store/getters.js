const pkg = state => state.pkg
const app = state => state.app
const device = state => state.app.device
const sidebar = state => state.app.sidebar
const effect = state => state.app.effect
const menuitems = state => state.menu.items
const results = state => state.results.data
const resultsChanged = state => state.results.changed
const dashboard = state => state.dashboard
const homeCharts = state => state.homeCharts
const configs = state => state.configs.data
const buildPackage = state => state.build.package
const buildNumber = state => state.build.number
const timeDiff = state => state.timeDiff.timeDiff
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
  dashboard,
  homeCharts,
  configs,
  buildPackage,
  buildNumber,
  timeDiff,
  componententry
}
