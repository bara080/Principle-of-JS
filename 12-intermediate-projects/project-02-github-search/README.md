# Project 02 — GitHub Profile Search

Type a GitHub username, see the profile. Debounced input, cancels in-flight
requests, retries transient failures, respects the GitHub API rate limit
headers.

## API

```js
const client = createGithubClient({ fetch, cache: new Map() })
const result = await client.getUser('octocat', { signal })
// { ok: true, data: { login, name, followers, ... } } or { ok: false, error }
```

## Acceptance criteria

- `fetch` is injected — swap for a stub in tests.
- Caches responses in-memory for 60 seconds.
- Handles rate-limit (403 with `x-ratelimit-remaining: 0`) with a helpful error.
- Cancels via `AbortSignal`.
- The DOM shell debounces input at 300ms.

Run: `node --test 12-intermediate-projects/project-02-github-search/tests/`.
