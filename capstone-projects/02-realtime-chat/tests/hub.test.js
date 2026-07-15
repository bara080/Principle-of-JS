// Unit tests for the hub — no WebSocket. Uses a fake `send` function.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

import { createHub } from '../src/hub.js'

function fakeUser(hub, name) {
  const inbox = []
  const send = (msg) => inbox.push(msg)
  const id = hub.connect({ name, send })
  return { id, send, inbox }
}

describe('hub — happy path', () => {
  test('welcome on connect', () => {
    const hub = createHub()
    const ada = fakeUser(hub, 'ada')
    assert.equal(ada.inbox[0].type, 'welcome')
    assert.equal(ada.inbox[0].userId, ada.id)
  })

  test('joining a room broadcasts a roster', () => {
    const hub = createHub()
    const ada = fakeUser(hub, 'ada')
    const grace = fakeUser(hub, 'grace')
    hub.join(ada.id, 'general')
    hub.join(grace.id, 'general')
    const lastRoster = grace.inbox.filter((m) => m.type === 'roster').at(-1)
    assert.equal(lastRoster.users.length, 2)
  })

  test('messages fan out to room members only', () => {
    const hub = createHub()
    const ada = fakeUser(hub, 'ada')
    const grace = fakeUser(hub, 'grace')
    const linus = fakeUser(hub, 'linus')

    hub.join(ada.id, 'js')
    hub.join(grace.id, 'js')
    // linus is not in 'js'
    hub.say(ada.id, 'js', 'hi')

    assert.ok(grace.inbox.some((m) => m.type === 'msg' && m.text === 'hi'))
    assert.ok(!linus.inbox.some((m) => m.type === 'msg' && m.text === 'hi'))
  })
})

describe('hub — enforcement', () => {
  test('rejects messages to unjoined rooms', () => {
    const hub = createHub()
    const ada = fakeUser(hub, 'ada')
    hub.say(ada.id, 'general', 'hi')
    const err = ada.inbox.find((m) => m.type === 'error')
    assert.equal(err.code, 'not_in_room')
  })

  test('rate-limits after N messages', () => {
    const hub = createHub({ rateLimit: { count: 3, windowMs: 1000 } })
    const ada = fakeUser(hub, 'ada')
    hub.join(ada.id, 'general')
    hub.say(ada.id, 'general', '1')
    hub.say(ada.id, 'general', '2')
    hub.say(ada.id, 'general', '3')
    hub.say(ada.id, 'general', '4')
    const errs = ada.inbox.filter((m) => m.type === 'error' && m.code === 'rate_limited')
    assert.equal(errs.length, 1)
  })

  test('trims history to the limit', () => {
    const hub = createHub({ historyLimit: 3 })
    const ada = fakeUser(hub, 'ada')
    hub.join(ada.id, 'general')
    for (let i = 0; i < 5; i++) hub.say(ada.id, 'general', `m${i}`)

    // A newcomer's history should have only 3.
    const grace = fakeUser(hub, 'grace')
    hub.join(grace.id, 'general')
    const history = grace.inbox.find((m) => m.type === 'history')
    assert.equal(history.messages.length, 3)
  })
})
