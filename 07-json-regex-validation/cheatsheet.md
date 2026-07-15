# Cheatsheet — JSON, Regex, Validation

## JSON

```js
JSON.stringify({ a: 1 }, null, 2)               // pretty
JSON.stringify(user, (k, v) => k === 'password' ? undefined : v)  // redact
JSON.parse(raw, (k, v) => k === 'date' ? new Date(v) : v)         // revive

// Safe parse — return errors as data
function safeJson(s) {
  try { return { ok: true, data: JSON.parse(s) } }
  catch (err) { return { ok: false, error: err.message } }
}
```

## Regex — the ones worth knowing

```js
const SLUG = /^[a-z0-9-]+$/
const HEX  = /^#[0-9a-f]{6}$/i
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

'abc-123'.match(SLUG)         // Array-like on match, null on no match
SLUG.test('abc-123')          // boolean
'a b c'.split(/\s+/)          // ['a','b','c']
'foo-bar'.replace(/-/g, '_')  // 'foo_bar' — remember the g
```

## Validation pattern

```js
function validate(input) {
  const errors = []
  if (typeof input?.name !== 'string' || !input.name.trim()) {
    errors.push({ field: 'name', message: 'required' })
  }
  const age = Number.parseInt(input?.age, 10)
  if (!Number.isFinite(age) || age < 13) {
    errors.push({ field: 'age', message: 'must be ≥ 13' })
  }
  if (errors.length) return { ok: false, errors }
  return { ok: true, data: { name: input.name.trim(), age } }
}
```

## Interview tips

- Always ask about anchors when writing a regex — a missing `^…$` is a bug.
- `structuredClone` beats JSON round-trip for in-memory copies.
- For schemas at scale, Zod is the reference — mention it in interviews.
