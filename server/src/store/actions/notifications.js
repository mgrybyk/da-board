function notify(data, eventType, err) {
  let msg = { name: data.name }
  if (err) {
    if (err.message) err = err.message
    err = err.toString()
    msg.error = `${err.substr(0, 280)}${err.length > 280 && '...' || ''}`
  }
  if (data['__socket']) {
    data['__socket'].emit(eventType, msg)
  } else {
    io.emit(eventType, msg)
  }
}

const actions = {
  notifyDeleteErr({ }, data) {
    let err = data.err ? data.err : `Item '${data.name}' was not found in db.`
    notify(data, 'SOCKET_DELETE_ERROR', err)
  },

  notifyDeleteOk({ }, data) {
    notify(data, 'SOCKET_DELETE_OK')
  },

  notifyDialogErr({ }, data) {
    let err = data.err ? data.err : 'Please check all the fields and try again.'
    notify(data, 'SOCKET_DIALOG_ERROR', err)
  },

  notifyDialogOk({ }, data) {
    notify(data, 'SOCKET_DIALOG_OK')
  }
}

module.exports = actions
