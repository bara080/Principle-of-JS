import { test } from 'node:test'
import assert from 'node:assert/strict'

import { createFetch } from './index.js'

test('returns first successful response', { skip: 'implement first' }, async () => {
  let calls = 0
  const stub = async () => {
    calls++
    if (calls < 2) throw new Error('flaky')
    return new Response('ok', { status: 200 })
  }
  const client = createFetch({ retry: { attempts: 3, base: 1 }, fetch: stub })
  const res = await client('/x')
  assert.equal(await res.text(), 'ok')
  assert.equal(calls, 2)
})

test('does not retry 4xx', { skip: 'implement first' }, async () => {
  let calls = 0
  const stub = async () => {
    calls++
    return new Response('bad', { status: 400 })
  }
  const client = createFetch({ retry: { attempts: 3, base: 1 }, fetch: stub })
  const res = await client('/x')
  assert.equal(res.status, 400)
  assert.equal(calls, 1)
})
