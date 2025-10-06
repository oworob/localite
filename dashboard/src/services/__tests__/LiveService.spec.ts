import { describe, expect, it, vi } from 'vitest'
import LiveService from '../LiveService'

vi.mock('socket.io-client', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { EventEmitter } = require('events')
  return {
    io: vi.fn(() => {
      const emitter = new EventEmitter()
      emitter.connect = vi.fn(() => emitter.emit('connect'))
      emitter.disconnect = vi.fn(() => emitter.emit('disconnect'))
      return emitter
    }),
  }
})

describe('LiveService', () => {
  it('connects to and disconnects from socket', () => {
    LiveService.connect()
    expect(LiveService.connected.value).toBe(true)

    LiveService.disconnect()
    expect(LiveService.connected.value).toBe(false)
  })
})
