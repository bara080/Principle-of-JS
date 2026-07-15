# Mini-Project — Resilient Fetch Client

A drop-in `fetch` wrapper with production-grade defaults: timeout, retry
with exponential backoff + jitter, and proper cancellation. Same signature as
`fetch`; adds an `options.timeoutMs` and `options.retry`.

## Files

```text
mini-project/
├── README.md
├── index.js         — createFetch(defaults) → fetch-like function
└── index.test.js    — tests (mock server via node:http or fetch stubs)
```

## Requirements

- Retries on network errors and 5xx. Never retries 4xx.
- Uses a fresh `AbortController` per attempt.
- Exponential backoff with jitter: `delay = base * 2^attempt * (0.5 + rand*0.5)`.
- Caps at `retry.attempts` (default 3). Timeout defaults to 5000ms.
- Propagates the caller's `AbortSignal` — aborting stops retries immediately.
- Returns the final `Response` on success; throws the last error on exhaustion.

## Run

```bash
node --test 06-async/mini-project/index.test.js
```
