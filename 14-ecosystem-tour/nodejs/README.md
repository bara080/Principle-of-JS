# Node.js

The JavaScript runtime for anything outside a browser. Chrome's V8 engine +
`libuv` (event loop, filesystem, network) + a standard library.

## What it is

A single binary (`node`) that runs `.js` and `.mjs` files. Node 20 LTS is the
current baseline; new projects should target 22.

## When to reach for it

- Backend HTTP services.
- CLIs and dev tooling (build scripts, scaffolding, linters).
- Serverless functions on Vercel, Cloudflare Workers (via compatible API subset).

## When to avoid it

- CPU-bound math on huge workloads — a compiled language wins.
- Shipping a browser bundle — you still need a bundler (Vite/Webpack/Rollup).

## Minimum-viable setup

```bash
# Install
brew install node             # macOS
# or use fnm / nvm for multiple versions

node --version                # verify
node -e "console.log('hi')"   # inline eval
```

## Handy built-ins to know

- `node:fs/promises` — filesystem.
- `node:path` — path manipulation.
- `node:crypto` — hashing, HMAC, `randomUUID`.
- `node:test` + `node:assert/strict` — testing.
- `node:util.styleText` — colored console output.
- Global `fetch`, `AbortController`, `FormData` since Node 18.

## Debugging

```bash
node --inspect-brk file.js    # pause at start, attach in Chrome DevTools
node --watch file.js          # restart on save
```

## Interview tips

- Single-threaded, non-blocking I/O via `libuv`. CPU work blocks — use worker
  threads.
- Event loop phases: timers → pending → idle/prepare → poll → check → close.
- Microtasks run between phases.
