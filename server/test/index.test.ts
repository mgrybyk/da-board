import axios from 'axios'
import express from 'express'
import getPort from 'get-port'
import mongoose from 'mongoose'

import { setAllowDisconnect } from '../src/config/mongodb.js'
import config from '../src/config/config.js'

describe('main', () => {
  const expressSpy = jest.spyOn(express.application, 'listen')

  beforeAll(async () => {
    setAllowDisconnect(true)
    config.serverPort = await getPort()
    require('../src/server')
  })

  it('should run server on proper port', () => {
    expect(expressSpy).toBeCalledTimes(1)
    expect(expressSpy).toBeCalledWith(config.serverPort, '127.0.0.1', expect.any(Function))
  })

  it('should response to liveness health check', async () => {
    const result = await axios.get(`http://localhost:${config.serverPort}/health/liveness`, {
      responseType: 'json',
    })
    const body = result.data as { status: string }
    expect(body.status).toBe('UP')
    expect(result.status).toBe(200)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    expressSpy.mock.results[0].value?.close()
    expressSpy.mockClear()
  })
})
