// Room hub — pure state, no WebSocket knowledge.
// The transport layer (server.js) plugs into these hooks.

import { randomUUID } from 'node:crypto'

export function createHub({ historyLimit = 50, rateLimit = { count: 10, windowMs: 5000 } } = {}) {
  const users = new Map()       // userId → { id, name, rooms: Set, hits: [ms, ...], send }
  const rooms = new Map()       // room → { members: Set<userId>, history: [] }

  function room(name) {
    if (!rooms.has(name)) rooms.set(name, { members: new Set(), history: [] })
    return rooms.get(name)
  }

  function join(userId, roomName) {
    const user = users.get(userId)
    if (!user) return
    user.rooms.add(roomName)
    const r = room(roomName)
    r.members.add(userId)
    broadcast(roomName, { type: 'roster', room: roomName, users: rosterFor(roomName) })
    user.send({ type: 'history', room: roomName, messages: [...r.history] })
  }

  function leave(userId, roomName) {
    const user = users.get(userId)
    if (!user) return
    user.rooms.delete(roomName)
    const r = rooms.get(roomName)
    if (!r) return
    r.members.delete(userId)
    broadcast(roomName, { type: 'roster', room: roomName, users: rosterFor(roomName) })
  }

  function connect({ name, send }) {
    if (typeof name !== 'string' || !name.trim()) throw new Error('name required')
    const id = randomUUID()
    users.set(id, { id, name: name.trim().slice(0, 40), rooms: new Set(), hits: [], send })
    send({ type: 'welcome', userId: id, rooms: [] })
    return id
  }

  function disconnect(userId) {
    const user = users.get(userId)
    if (!user) return
    for (const roomName of user.rooms) {
      const r = rooms.get(roomName)
      r?.members.delete(userId)
      broadcast(roomName, { type: 'roster', room: roomName, users: rosterFor(roomName) })
    }
    users.delete(userId)
  }

  function say(userId, roomName, text) {
    const user = users.get(userId)
    if (!user) return
    if (!user.rooms.has(roomName)) {
      user.send({ type: 'error', code: 'not_in_room', message: `join ${roomName} first` })
      return
    }
    if (typeof text !== 'string' || !text.trim()) {
      user.send({ type: 'error', code: 'empty', message: 'text required' })
      return
    }

    // Rate-limit — drop oldest hits outside the window, then check size.
    const now = Date.now()
    user.hits = user.hits.filter((t) => now - t < rateLimit.windowMs)
    if (user.hits.length >= rateLimit.count) {
      user.send({ type: 'error', code: 'rate_limited', message: 'slow down' })
      return
    }
    user.hits.push(now)

    const msg = {
      type: 'msg',
      room: roomName,
      userId: user.id,
      name: user.name,
      text: text.slice(0, 2000),
      at: new Date().toISOString(),
    }
    const r = room(roomName)
    r.history.push(msg)
    if (r.history.length > historyLimit) r.history.shift()
    broadcast(roomName, msg)
  }

  function broadcast(roomName, payload) {
    const r = rooms.get(roomName)
    if (!r) return
    for (const memberId of r.members) {
      const member = users.get(memberId)
      member?.send(payload)
    }
  }

  function rosterFor(roomName) {
    const r = rooms.get(roomName)
    if (!r) return []
    return [...r.members].map((id) => {
      const u = users.get(id)
      return { id, name: u?.name ?? '?' }
    })
  }

  return {
    connect,
    disconnect,
    join,
    leave,
    say,
    // introspection for tests
    stats: () => ({ users: users.size, rooms: rooms.size }),
  }
}
