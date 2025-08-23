import { io, type Socket } from 'socket.io-client'
import { ref } from 'vue'

class LiveService {
  public socket: Socket
  public connected = ref(false)

  constructor() {
    this.socket = io('http://localhost:5000', {
      autoConnect: false,
      withCredentials: true,
    })
    this.socket.on('connect', () => {
      this.connected.value = true
    })
    this.socket.on('disconnect', () => {
      this.connected.value = false
    })
  }

  connect() {
    this.socket.connect()
  }

  disconnect() {
    this.socket.disconnect()
  }
}

export default new LiveService()
