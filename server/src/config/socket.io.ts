import { Server } from 'socket.io'

import { server } from '../server.js'

export const io = new Server(server)
