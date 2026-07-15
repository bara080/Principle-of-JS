// Load-test client. Spawns N concurrent chatters that all send messages.
// Usage: node src/client-load.js 50

import { WebSocket } from 'ws'

const n = Number.parseInt(process.argv[2] ?? '10', 10)
const url = process.env.CHAT_URL ?? 'ws://localhost:4000'

async function chatter(i) {
  const ws = new WebSocket(url)
  await new Promise((r) => ws.once('open', r))
  ws.send(JSON.stringify({ type: 'hello', name: `bot-${i}` }))
  ws.send(JSON.stringify({ type: 'join', room: 'general' }))
  for (let k = 0; k < 5; k++) {
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300))
    ws.send(JSON.stringify({ type: 'msg', room: 'general', text: `hi ${k} from ${i}` }))
  }
  await new Promise((r) => setTimeout(r, 500))
  ws.close()
}

const started = Date.now()
await Promise.all(Array.from({ length: n }, (_, i) => chatter(i)))
console.log(`done — ${n} bots in ${Date.now() - started}ms`)
