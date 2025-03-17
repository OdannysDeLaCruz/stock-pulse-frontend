import type { StockPartialWebsocketResponse } from '@/types'

let socket: WebSocket | null = null
let reconnectTimeout: number | null = null

export const connectWebSocket = (
  stockTicker: string,
  onMessage: (data: StockPartialWebsocketResponse) => void,
) => {
  if (socket) {
    socket.close()
  }

  socket = new WebSocket(`${import.meta.env.VITE_HOST_WEBSOCKET}/stocks/ws?ticker=${stockTicker}`)

  socket.onopen = () => {
    console.log(`Conectado al WebSocket para stock ${stockTicker}`)
  }

  socket.onmessage = (event: MessageEvent) => {
    try {
      const data: StockPartialWebsocketResponse = JSON.parse(event.data)
      onMessage(data)
    } catch (error) {
      console.error('Error procesando mensaje WebSocket:', error)
    }
  }

  socket.onerror = (error) => {
    console.error('WebSocket Error:', error)
    reconnect(stockTicker, onMessage)
  }

  socket.onclose = () => {
    console.log(`WebSocket cerrado para stock ${stockTicker}`)
    reconnect(stockTicker, onMessage)
  }
}

const reconnect = (
  stockTicker: string,
  onMessage: (data: StockPartialWebsocketResponse) => void,
) => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
  }
  reconnectTimeout = setTimeout(() => {
    console.log('Reintentando conexión...')
    connectWebSocket(stockTicker, onMessage)
  }, 3000)
}

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close()
    socket = null
  }
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }
}
