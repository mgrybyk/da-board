import type { Socket, Server } from 'socket.io'
import type { IncomingMessage } from 'http'
import type { PassportLocalModel } from 'mongoose'

import { notifyDeleteErr, notifyDeleteOk, notifyDialogErr, notifyDialogOk } from './controllers/notifications.js'
import { BuildsModel } from './models/Builds.js'
import { buildActions } from './controllers/build.js'
import { UserModel } from './models/User.js'
import { HomeLinksModel } from './models/HomeLinks.js'
import { homeLinkActions } from './controllers/homeLink.js'

type SocketEventType = 'BUILDS' | 'HOMELINKS' | 'USERS'

interface PassportIncomingMessage extends IncomingMessage {
  isAuthenticated: () => boolean
  logout: () => void
}
interface PassportSocket extends Socket {
  request: PassportIncomingMessage
}

export const setupSocketListeners = (io: Server) => {
  // @ts-ignore
  io.on('connection', function (socket: PassportSocket) {
    // tiles
    // addGetListener(socket, 'TILES', 'tiles')

    // integrations
    // addGetUpdateDeleteListeners(socket, 'INTEGRATIONS', 'integrations', 'Integration')

    // builds
    addCRUDListeners(socket, 'BUILDS', BuildsModel, buildActions)

    // homelinks
    addCRUDListeners(socket, 'HOMELINKS', HomeLinksModel, homeLinkActions)

    // settings
    // addGetUpdateDeleteListeners(socket, 'SETTINGS', 'settings', 'Settings')

    // configs
    // addGetUpdateDeleteListeners(socket, 'CONFIGS', 'configs', 'Config')

    // time sync
    socket.on('TIME_SYNC', () => {
      socket.emit('SOCKET_TIME_SYNC', { time: new Date().getTime() })
    })

    // logout
    socket.on('LOGOUT', () => {
      if (socket.request.isAuthenticated()) {
        socket.request.logout()
      }
    })

    // users
    addGetListener(socket, 'USERS', UserModel)
    // TODO
    // USERS_UPDATE_ONE, USERS_RESET, USERS_DELETE
  })
}

function addGetListener<T>(socket: PassportSocket, eventType: SocketEventType, model: PassportLocalModel<T>) {
  socket.on(`GET_${eventType}`, async () => {
    const result = await model.find({})
    socket.emit(`SOCKET_${eventType}`, result)
  })
}

enum EventActions {
  UPDATE_ONE = 'UPDATE_ONE',
  NEW = 'NEW',
  COPY = 'COPY',
  DELETE = 'DELETE',
}

const sendCreateOrUpdate = async (
  data: Record<string, unknown>,
  socket: PassportSocket,
  eventType: SocketEventType,
  eventAction: EventActions,
  actions: CreateUpdateDeleteActions
) => {
  try {
    socket.emit(`SOCKET_${eventType}_${eventAction}`, await actions.createOrUpdate(data))
    notifyDialogOk(socket)
  } catch (err: any) {
    console.error(eventType, eventAction, err)
    notifyDialogErr(socket, err)
  }
}

const createOrCopy = <T>(
  eventAction: EventActions,
  socket: PassportSocket,
  eventType: SocketEventType,
  model: PassportLocalModel<T>,
  actions: CreateUpdateDeleteActions
) => {
  return async (data: Record<string, unknown>) => {
    if (!socket.request.isAuthenticated()) {
      return
    }

    const result = await model.findOne(actions.filter(data))
    if (result) {
      return notifyDialogErr(socket, 'Unable to create a new item. The same item already exists.')
    }

    sendCreateOrUpdate(data, socket, eventType, eventAction, actions)
  }
}

function addCRUDListeners<T>(
  socket: PassportSocket,
  eventType: SocketEventType,
  model: PassportLocalModel<T>,
  actions: CreateUpdateDeleteActions
) {
  addGetListener(socket, eventType, model)

  socket.on(`${eventType}_${EventActions.UPDATE_ONE}`, async (data: Record<string, unknown>) => {
    if (!socket.request.isAuthenticated()) {
      return
    }
    Object.keys(data)
      .filter((key) => data[key] === null)
      .forEach((key) => {
        data[key] = undefined
      })

    sendCreateOrUpdate(data, socket, eventType, EventActions.UPDATE_ONE, actions)
  })

  socket.on(`${eventType}_${EventActions.NEW}`, createOrCopy(EventActions.NEW, socket, eventType, model, actions))
  socket.on(`${eventType}_${EventActions.COPY}`, createOrCopy(EventActions.COPY, socket, eventType, model, actions))

  socket.on(`${eventType}_${EventActions.DELETE}`, async (data) => {
    if (!socket.request.isAuthenticated()) {
      return
    }
    try {
      socket.emit(`SOCKET_${eventType}_${EventActions.DELETE}`, await actions.remove(data))
      notifyDeleteOk(socket)
    } catch (err: any) {
      console.error(eventType, EventActions.DELETE, err)
      notifyDeleteErr(socket, err)
    }
  })
}
