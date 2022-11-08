import type { Socket } from 'socket.io'

const processError = (err: string | Error) => {
  let error: string
  if (typeof err === 'string') {
    error = err
  } else if (typeof err.message === 'string') {
    error = err.message
  } else {
    error = 'Unknown error'
  }
  error = `${error.substring(0, 280)}${(error.length > 280 && '...') || ''}`
  return error
}

export const notifyDeleteErr = (socket: Socket, error: string | Error) => {
  socket.emit('SOCKET_DELETE_ERROR', { error: processError(error) })
}

export const notifyDeleteOk = (socket: Socket) => {
  socket.emit('SOCKET_DELETE_OK', {})
}

export const notifyDialogErr = (socket: Socket, error: string | Error) => {
  socket.emit('SOCKET_DIALOG_ERROR', { error: processError(error) })
}

export const notifyDialogOk = (socket: Socket) => {
  socket.emit('SOCKET_DIALOG_OK', {})
}
