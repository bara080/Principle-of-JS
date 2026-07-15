import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

import { createStore } from '../src/store.js'

describe('createStore', () => {
  test('setState triggers subscribers', () => {
    const store = createStore({ n: 0 })
    const seen = []
    store.subscribe((state) => seen.push(state.n))
    store.setState({ n: 1 })
    store.setState((s) => ({ n: s.n + 1 }))
    assert.deepEqual(seen, [1, 2])
  })

  test('unsubscribe stops updates', () => {
    const store = createStore({ n: 0 })
    const seen = []
    const off = store.subscribe((state) => seen.push(state.n))
    store.setState({ n: 1 })
    off()
    store.setState({ n: 2 })
    assert.deepEqual(seen, [1])
  })
})
