// WebSocket transport. Delegates all logic to hub.js.

import { WebSocketServer } from 'ws'
import { createHub } from './hub.js'

const HELLO_TIMEOUT_MS = 5000
const MAX_BUFFERED_BYTES = 1_000_000

export function startServer({ port = 4000 } = {}) {
  const hub = createHub()
  const wss = new WebSocketServer({ port })

  wss.on('connection', (ws) => {
    let userId = null

    const send = (payload) => {
      try {
        if (ws.readyState !== ws.OPEN) return
        if (ws.bufferedAmount > MAX_BUFFERED_BYTES) {
          ws.close(1013, 'backpressure')
          return
        }
        ws.send(JSON.stringify(payload))
      } catch {
        // Serialization errors are non-fatal — drop the message.
      }
    }

    const helloTimer = setTimeout(() => {
      if (!userId) ws.close(1002, 'hello timeout')
    }, HELLO_TIMEOUT_MS)

    ws.on('message', (data) => {
      let msg
      try { msg = JSON.parse(data.toString('utf8')) }
      catch { return send({ type: 'error', code: 'bad_json', message: 'malformed JSON' }) }

      if (!msg || typeof msg !== 'object') {
        return send({ type: 'error', code: 'bad_shape', message: 'expected object' })
      }

      try {
        switch (msg.type) {
          case 'hello': {
            if (userId) return send({ type: 'error', code: 'already_hello' })
            userId = hub.connect({ name: msg.name, send })
            clearTimeout(helloTimer)
            return
          }
          case 'join':
            if (!userId) return send({ type: 'error', code: 'need_hello' })
            hub.join(userId, String(msg.room ?? ''))
            return
          case 'leave':
            if (!userId) return send({ type: 'error', code: 'need_hello' })
            hub.leave(userId, String(msg.room ?? ''))
            return
          case 'msg':
            if (!userId) return send({ type: 'error', code: 'need_hello' })
            hub.say(userId, String(msg.room ?? ''), String(msg.text ?? ''))
            return
          default:
            send({ type: 'error', code: 'unknown_type', message: `unknown type: ${msg.type}` })
        }
      } catch (err) {
        send({ type: 'error', code: 'internal', message: err.message })
      }
    })

    ws.on('close', () => {
      clearTimeout(helloTimer)
      if (userId) hub.disconnect(userId)
    })
  })

  return { wss, hub, port: wss.address().port }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number.parseInt(process.env.PORT ?? '4000', 10)
  const { port: bound } = startServer({ port })
  console.log(`chat server on ws://localhost:${bound}`)
}
