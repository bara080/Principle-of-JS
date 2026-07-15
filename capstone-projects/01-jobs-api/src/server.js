// HTTP entry point. Composed from the modules in src/.

import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'

import { createStore } from './store.js'
import { hashPassword, verifyPassword, createTokenIssuer } from './auth.js'
import { createRouter } from './router.js'
import {
  validateRegistration,
  validateLogin,
  validateJobCreate,
  orThrow,
} from './validate.js'
import {
  AppError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from './errors.js'

export function createApp({ store = createStore(), secret = process.env.TOKEN_SECRET ?? 'dev-secret-change-me' } = {}) {
  const tokens = createTokenIssuer(secret)
  const router = createRouter()

  // --- Auth ----------------------------------------------------------------
  router.post('/auth/register', async (ctx) => {
    const { email, password, role } = orThrow(validateRegistration(ctx.body))
    if (store.users.findByEmail(email)) throw new ConflictError('email already registered')
    const user = store.users.create({ email, role, passwordHash: hashPassword(password) })
    return { status: 201, body: { user: publicUser(user) } }
  })

  router.post('/auth/login', async (ctx) => {
    const { email, password } = orThrow(validateLogin(ctx.body))
    const user = store.users.findByEmail(email)
    if (!user || !verifyPassword(password, user.passwordHash)) throw new AuthError('invalid credentials')
    return { body: { token: tokens.issue(user), user: publicUser(user) } }
  })

  // --- Me ------------------------------------------------------------------
  router.get('/me', async (ctx) => {
    const user = requireUser(ctx)
    return { body: { user: publicUser(user) } }
  })

  router.get('/me/applications', async (ctx) => {
    const user = requireUser(ctx)
    if (user.role !== 'applicant') throw new ForbiddenError()
    return { body: { applications: store.applications.listByApplicant(user.id) } }
  })

  // --- Jobs ----------------------------------------------------------------
  router.get('/jobs', async (ctx) => {
    const q = ctx.query.get('q') ?? undefined
    const location = ctx.query.get('location') ?? undefined
    const remoteRaw = ctx.query.get('remote')
    const remote = remoteRaw === 'true' ? true : remoteRaw === 'false' ? false : undefined
    return { body: { jobs: store.jobs.list({ q, location, remote }) } }
  })

  router.get('/jobs/:id', async (ctx) => {
    const job = store.jobs.find(ctx.params.id)
    if (!job) throw new NotFoundError()
    return { body: { job } }
  })

  router.post('/jobs', async (ctx) => {
    const user = requireUser(ctx)
    if (user.role !== 'employer' && user.role !== 'admin') throw new ForbiddenError()
    const data = orThrow(validateJobCreate(ctx.body))
    const job = store.jobs.create({ ...data, ownerId: user.id })
    return { status: 201, body: { job } }
  })

  router.patch('/jobs/:id', async (ctx) => {
    const user = requireUser(ctx)
    const job = store.jobs.find(ctx.params.id)
    if (!job) throw new NotFoundError()
    if (job.ownerId !== user.id && user.role !== 'admin') throw new ForbiddenError()
    const updated = store.jobs.update(ctx.params.id, ctx.body ?? {})
    return { body: { job: updated } }
  })

  router.delete('/jobs/:id', async (ctx) => {
    const user = requireUser(ctx)
    const job = store.jobs.find(ctx.params.id)
    if (!job) throw new NotFoundError()
    if (job.ownerId !== user.id && user.role !== 'admin') throw new ForbiddenError()
    store.jobs.delete(ctx.params.id)
    return { status: 204 }
  })

  router.post('/jobs/:id/apply', async (ctx) => {
    const user = requireUser(ctx)
    if (user.role !== 'applicant') throw new ForbiddenError()
    const job = store.jobs.find(ctx.params.id)
    if (!job) throw new NotFoundError()
    if (store.applications.hasApplied(job.id, user.id)) throw new ConflictError('already applied')
    const application = store.applications.create({
      jobId: job.id,
      applicantId: user.id,
      coverLetter: String(ctx.body?.coverLetter ?? '').slice(0, 4000),
    })
    return { status: 201, body: { application } }
  })

  // --- Helpers -------------------------------------------------------------
  function publicUser(u) { return { id: u.id, email: u.email, role: u.role } }

  function requireUser(ctx) {
    const header = ctx.req.headers.authorization ?? ''
    const [scheme, token] = header.split(' ')
    if (scheme !== 'Bearer' || !token) throw new AuthError()
    const payload = tokens.verify(token)
    const user = store.users.find(payload.sub)
    if (!user) throw new AuthError()
    return user
  }

  // --- Server core ---------------------------------------------------------
  const server = createServer(async (req, res) => {
    const requestId = randomUUID()
    const startedAt = performance.now()
    const url = new URL(req.url, 'http://localhost')

    let status = 200
    let responseBody

    try {
      const match = router.find(req.method, url.pathname)
      if (!match) throw new NotFoundError('route not found')

      const body = await readJson(req)
      const ctx = { req, params: match.params, query: url.searchParams, body }
      const result = (await match.handler(ctx)) ?? {}
      status = result.status ?? 200
      responseBody = result.body
    } catch (err) {
      if (err instanceof AppError) {
        status = err.status
        responseBody = { error: err.toJSON() }
      } else {
        status = 500
        responseBody = { error: { code: 'internal', message: 'internal error' } }
        console.error(`[${requestId}]`, err)
      }
    }

    const ms = (performance.now() - startedAt).toFixed(1)
    console.log(JSON.stringify({
      method: req.method,
      path: url.pathname,
      status,
      ms: Number(ms),
      requestId,
    }))

    res.writeHead(status, { 'content-type': 'application/json', 'x-request-id': requestId })
    res.end(responseBody === undefined ? '' : JSON.stringify(responseBody))
  })

  return { server, store, tokens }
}

async function readJson(req) {
  if (req.method === 'GET' || req.method === 'DELETE') return {}
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return {}
  const raw = Buffer.concat(chunks).toString('utf8')
  try {
    return JSON.parse(raw)
  } catch {
    throw new AppError('malformed JSON', { status: 400, code: 'bad_json' })
  }
}

// Only start listening when run directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number.parseInt(process.env.PORT ?? '3000', 10)
  const { server } = createApp()
  server.listen(port, () => console.log(`jobs-api listening on http://localhost:${port}`))
}
