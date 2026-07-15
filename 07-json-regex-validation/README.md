# Module 07 — JSON, Regex & Validation

> The seam between your program and the outside world. Get parsing and
> validation right and half your bugs vanish.

## Learning Objectives

- Parse and stringify JSON safely, including with replacers and revivers.
- Read a regex without panic; write patterns for common formats.
- Validate structured input (a form payload, an API response).
- Choose between hand-rolled validators, Zod, and JSON Schema — and know when
  each fits.

## Why This Topic Matters

Every request body, every API response, every uploaded file — anything from
outside is a wall of untrusted bytes. Validation is your program's boundary
between "I know this shape" and "anything could be here." Without it, you get
`Cannot read property 'x' of undefined` at 3 AM.

## Where It Is Used In Production

- API request/response validation (Zod schemas in Express/Next handlers).
- Form validation with real-time UX feedback.
- Config file parsing at boot.
- Log parsing, redaction of PII.
- CSV/TSV ingestion.

## Prerequisites

Modules 01–04.

## Skills Gained

- Confidence reading regexes.
- Writing validators that produce good error messages for humans, not developers.
- Recognizing ReDoS patterns and avoiding them.

## Estimated Completion Time

- Reading: 90 min · Exercises: 3 hr · Mini-project: 2 hr.

## Common Mistakes

1. `JSON.parse` without a `try` — malformed input crashes the process.
2. Regex without anchors (`^…$`) — matches substrings when you meant "whole string."
3. Catastrophic backtracking — `(a+)+$` on `aaaaX` blows up.
4. Validating email with a monster regex from Stack Overflow — a simple shape
   check + confirmation email is more reliable.
5. Trusting the client. Always re-validate on the server.

## Best Practices

- Validate at every trust boundary: request body, response body, env, storage.
- Fail with a **field**+**message** pair per error; UI can render field-level.
- Return typed data on success. Callers should not re-check.
- Use `AbortController` on regex if untrusted (Node 22+ `RegExp.prototype.exec`
  accepts a `signal` in some runtimes; otherwise cap input length).

## Mini-Project Overview

**`mini-project/`** — a tiny schema library. Compose validators with a fluent
API: `s.object({ email: s.string().email(), age: s.number().int().min(13) })`.
Returns `{ ok, data | errors }`.

## Recommended Resources

- MDN — JSON, RegExp reference.
- <https://regex101.com/> — interactive regex debugger.
- Zod docs — for a look at the reference design.
