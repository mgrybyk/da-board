const store = {}

const use = ({ state, getters, actions, mutations }) => {
  store._state = state
  store._getters = {}
  store._actions = actions
  store._mutations = mutations
  wrapGetters(getters)
}

function wrapGetters (getters) {
  Object.keys(getters).forEach(key => {
    Object.defineProperty(store._getters, key, {
      get: () => getters[key](store._state)
    })
  })
}

const dispatch = (actionType, payload) => {
  const entry = store._actions[actionType]
  let state = store._state
  if (!entry) {
    console.error(`[store] unknown action type: ${actionType}`)
    return
  }
  return entry({ state, commit, dispatch }, payload)
}

const commit = (mutationType, payload) => {
  const entry = store._mutations[mutationType]
  if (!entry) {
    console.error(`[store] unknown mutation type: ${mutationType}`)
    return
  }
  entry(store._state, payload)
}

module.exports = {
  use: use,
  dispatch: dispatch,
  commit: commit,
  get getters () {
    return store._getters
  },
  get state () {
    return store._state
  }
}
