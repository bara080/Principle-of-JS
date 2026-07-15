// Integration tests — spin up the server, hit it with fetch.

import { test, before, after, describe } from 'node:test'
import assert from 'node:assert/strict'

import { createApp } from '../src/server.js'

let base
let stopServer

before(async () => {
  const { server } = createApp({ secret: 'test-secret-must-be-long-enough' })
  await new Promise((resolve) => server.listen(0, resolve))
  const port = server.address().port
  base = `http://localhost:${port}`
  stopServer = () => new Promise((r) => server.close(r))
})

after(() => stopServer?.())

async function json(method, path, body, token) {
  const res = await fetch(base + path, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = res.status === 204 ? null : await res.json()
  return { status: res.status, data }
}

describe('auth', () => {
  test('registers, logs in, reads /me', async () => {
    const reg = await json('POST', '/auth/register', {
      email: 'a@example.com',
      password: 'correct-horse-battery',
      role: 'applicant',
    })
    assert.equal(reg.status, 201)
    assert.equal(reg.data.user.email, 'a@example.com')

    const login = await json('POST', '/auth/login', {
      email: 'a@example.com',
      password: 'correct-horse-battery',
    })
    assert.equal(login.status, 200)
    assert.ok(login.data.token)

    const me = await json('GET', '/me', undefined, login.data.token)
    assert.equal(me.status, 200)
    assert.equal(me.data.user.role, 'applicant')
  })

  test('rejects duplicate email', async () => {
    await json('POST', '/auth/register', {
      email: 'dup@example.com', password: 'correct-horse-battery', role: 'applicant',
    })
    const r = await json('POST', '/auth/register', {
      email: 'dup@example.com', password: 'correct-horse-battery', role: 'applicant',
    })
    assert.equal(r.status, 409)
    assert.equal(r.data.error.code, 'conflict')
  })

  test('rejects invalid credentials', async () => {
    const r = await json('POST', '/auth/login', {
      email: 'nobody@example.com', password: 'nope',
    })
    assert.equal(r.status, 401)
  })
})

describe('jobs', () => {
  let employerToken
  let applicantToken
  let jobId

  before(async () => {
    const emp = await json('POST', '/auth/register', {
      email: 'e@example.com', password: 'correct-horse-battery', role: 'employer',
    })
    const empLogin = await json('POST', '/auth/login', {
      email: 'e@example.com', password: 'correct-horse-battery',
    })
    employerToken = empLogin.data.token

    await json('POST', '/auth/register', {
      email: 'app@example.com', password: 'correct-horse-battery', role: 'applicant',
    })
    const appLogin = await json('POST', '/auth/login', {
      email: 'app@example.com', password: 'correct-horse-battery',
    })
    applicantToken = appLogin.data.token
  })

  test('employer creates a job', async () => {
    const r = await json('POST', '/jobs', {
      title: 'Senior JS Engineer',
      description: 'Ship high-quality JavaScript.',
      location: 'Remote',
      remote: true,
    }, employerToken)
    assert.equal(r.status, 201)
    jobId = r.data.job.id
  })

  test('lists jobs (unauthenticated)', async () => {
    const r = await json('GET', '/jobs')
    assert.equal(r.status, 200)
    assert.ok(r.data.jobs.length >= 1)
  })

  test('applicant cannot create a job', async () => {
    const r = await json('POST', '/jobs', {
      title: 'x', description: 'x', location: 'x',
    }, applicantToken)
    assert.equal(r.status, 403)
  })

  test('applicant applies to a job', async () => {
    const r = await json('POST', `/jobs/${jobId}/apply`, {
      coverLetter: 'I would love to work here.',
    }, applicantToken)
    assert.equal(r.status, 201)
  })

  test('cannot apply twice to same job', async () => {
    const r = await json('POST', `/jobs/${jobId}/apply`, {
      coverLetter: 'again',
    }, applicantToken)
    assert.equal(r.status, 409)
  })

  test('validation errors are structured', async () => {
    const r = await json('POST', '/jobs', {
      // missing required fields
    }, employerToken)
    assert.equal(r.status, 400)
    assert.equal(r.data.error.code, 'validation')
    assert.ok(Array.isArray(r.data.error.fields))
  })

  test('404 for missing job', async () => {
    const r = await json('GET', '/jobs/does-not-exist')
    assert.equal(r.status, 404)
  })
})

describe('unhappy paths', () => {
  test('malformed JSON → 400', async () => {
    const res = await fetch(base + '/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not-json',
    })
    assert.equal(res.status, 400)
  })

  test('unknown route → 404', async () => {
    const r = await json('GET', '/nope')
    assert.equal(r.status, 404)
  })
})
