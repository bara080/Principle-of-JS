# 01 — Jobs API

A production-shaped REST service for a job board. Built on Node's built-in
`http` module — no Express, no Fastify. That's deliberate: you'll write the
routing, body parsing, auth middleware, and error handling yourself.

## What it does

- User registration + login (email/password), issues signed session tokens.
- Employers post jobs, edit their own, delete their own.
- Anyone (authenticated or not) can list, filter, and search jobs.
- Applicants can bookmark jobs and view their own applications.
- Admin role can moderate any job.

## Modules exercised

- **01 (fundamentals)** — input parsing, coercion at every boundary.
- **02 (functions)** — middleware composition.
- **03 (OOP)** — domain models (`User`, `Job`, `Application`).
- **06 (async)** — every handler is async, timeouts on external calls.
- **07 (JSON/validation)** — request bodies validated per-route.
- **08 (errors)** — typed error hierarchy → HTTP status mapping.
- **09 (testing)** — integration tests via `fetch` against a real server.
- **10 (tooling)** — ESM, `package.json` `exports`, TypeScript-ready.

## Acceptance criteria

### Routes

| Method | Path                    | Auth       | Notes                            |
|--------|-------------------------|------------|----------------------------------|
| POST   | `/auth/register`        | none       | body: `{email, password, role}` |
| POST   | `/auth/login`           | none       | returns `{token, user}`          |
| GET    | `/me`                   | user       | current user                     |
| GET    | `/jobs`                 | none       | supports `?q&location&remote`   |
| GET    | `/jobs/:id`             | none       |                                  |
| POST   | `/jobs`                 | employer   | create                           |
| PATCH  | `/jobs/:id`             | owner/admin| partial update                   |
| DELETE | `/jobs/:id`             | owner/admin|                                  |
| POST   | `/jobs/:id/apply`       | applicant  | body: `{coverLetter}`            |
| GET    | `/me/applications`      | applicant  |                                  |

### Non-functional

- All handlers respond within 100ms on the in-memory store.
- Every 4xx returns `{ error: { code, message, fields? } }`.
- 5xx returns `{ error: { code: 'internal' } }` — never leaks stack.
- Every request logs `{ method, path, status, ms, requestId }`.
- Bad JSON → 400, not a crash.

### Auth

- Passwords hashed with `crypto.scryptSync`.
- Tokens are HMAC-signed opaque strings — no external JWT library.
- Token expires 7 days after issue.

## Running

```bash
cd 01-jobs-api
node --env-file=.env src/server.js
# → server listening on http://localhost:3000

# In another shell:
curl -X POST http://localhost:3000/auth/register \
  -H content-type:application/json \
  -d '{"email":"e@e.com","password":"correct-horse-battery","role":"employer"}'
```

## Tests

```bash
node --test tests/
```

## Extensions

- Swap in-memory store for SQLite (`better-sqlite3`) or Postgres (`pg`).
- Rate-limit `/auth/login` (10/min/IP).
- Add job posting expiration (jobs auto-archive after 30 days).
- OpenAPI spec + a generated TS client.
- Deploy to Fly.io with a Dockerfile.

## What "done" looks like

- [ ] All acceptance-criteria routes work.
- [ ] Every error has a typed class and a mapped status.
- [ ] Tests cover auth, ownership, validation errors, 404s.
- [ ] Structured logs on every request.
- [ ] README documents install, run, extend.
