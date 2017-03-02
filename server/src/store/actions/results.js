const actions = {
  resultsChanged () {
    io.emit('SOCKET_RESULTS_CHANGED')
  }
}

module.exports = actions
