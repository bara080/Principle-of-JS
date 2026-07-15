import { test } from 'node:test'
import assert from 'node:assert/strict'

import { createGithubClient } from '../src/index.js'

test('returns error result on rate limit', { skip: 'implement first' }, async () => {
  const fetch = async () => new Response('rate limited', {
    status: 403,
    headers: { 'x-ratelimit-remaining': '0' },
  })
  const client = createGithubClient({ fetch })
  const r = await client.getUser('octocat')
  assert.equal(r.ok, false)
  assert.match(r.error, /rate/i)
})
