const pkg = state => state.pkg
const app = state => state.app
const device = state => state.app.device
const sidebar = state => state.app.sidebar
const effect = state => state.app.effect
const menuitems = state => state.menu.items
const results = state => state.results.data
const resultsChanged = state => state.results.changed
const tiles = state => state.tiles
const integrations = state => state.integrations.data
const configsObject = state => state.configs.data
const configs = state => {
  let configsArr = []
  Object.keys(state.configs.data).forEach(key => {
    configsArr.push(state.configs.data[key])
  })
  configsArr.sort((a, b) => a.sortBy - b.sortBy)
  // .sort((a, b) => {
  //   let aName = a.integration ? a.integration.name : 'z'
  //   let bName = b.integration ? b.integration.name : 'z'
  //   return (aName < bName) ? -1 : (aName > bName) ? 1 : 0
  // })
  return configsArr
}
const configsEnabled = state => configs(state).filter(config => config.disabled !== true)
const timeDiff = state => state.timeDiff.timeDiff
const auth = state => state.auth
const homeLinks = state => state.homeLinks.data
const settings = state => state.settings.data
const builds = state => state.builds.data
const users = state => state.users.data
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
  integrations,
  configsObject,
  configs,
  configsEnabled,
  timeDiff,
  auth,
  homeLinks,
  settings,
  builds,
  users,
  componententry
}
