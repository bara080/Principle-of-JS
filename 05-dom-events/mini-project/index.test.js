import { test } from 'node:test'
import assert from 'node:assert/strict'

import { createStore, loadState, saveState } from './index.js'

function fakeStorage(initial = {}) {
  const map = new Map(Object.entries(initial))
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  }
}

test('loadState returns [] on missing/corrupt storage', () => {
  assert.deepEqual(loadState(fakeStorage()), [])
  assert.deepEqual(loadState(fakeStorage({ 'todos.v1': 'not-json' })), [])
  assert.deepEqual(loadState(fakeStorage({ 'todos.v1': '"nope"' })), [])
})

test('saveState writes JSON', () => {
  const s = fakeStorage()
  saveState(s, [{ id: '1', text: 'x', done: false }])
  const raw = s.getItem('todos.v1')
  assert.deepEqual(JSON.parse(raw), [{ id: '1', text: 'x', done: false }])
})

test('createStore mutations', { skip: 'implement first' }, () => {
  const store = createStore()
  const id = store.add('learn delegation')
  store.toggle(id)
  const snap = store.snapshot()
  assert.equal(snap.length, 1)
  assert.equal(snap[0].done, true)
  store.remove(id)
  assert.equal(store.snapshot().length, 0)
})
