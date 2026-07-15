# Cheatsheet — Error Handling

## Throwing

```js
throw new Error('reason')
throw new TypeError('expected string, got number')
throw new AppError('user not found', { code: 'not_found', cause: dbErr })
```

## Custom hierarchy

```js
class AppError extends Error {
  constructor(msg, { code, cause } = {}) {
    super(msg, { cause })
    this.name = this.constructor.name
    this.code = code
  }
}
class NotFoundError extends AppError {}
class ValidationError extends AppError {}
```

## Catching

```js
try {
  await risky()
} catch (err) {
  if (err instanceof NotFoundError) return 404
  if (err instanceof ValidationError) return 400
  throw err
}
```

## Result type (errors as data)

```js
export const ok  = (data) => ({ ok: true, data })
export const err = (message, extra = {}) => ({ ok: false, error: { message, ...extra } })

const result = await tryFetch(url)
if (!result.ok) return renderError(result.error)
useData(result.data)
```

## Serialization

```js
JSON.stringify(new Error('x'))                  // '{}' — nothing
JSON.stringify(new Error('x'), Object.getOwnPropertyNames(new Error('x')))  // works
```

Prefer a helper — see concepts.md.

## Process-level

```js
process.on('uncaughtException', (err) => { log(err); process.exit(1) })
process.on('unhandledRejection', (reason) => { log(reason); process.exit(1) })
```

## Interview tips

- Always set `this.name` in a custom error.
- `Error(msg, { cause })` (ES2022) is the modern way to chain.
- Never `catch` unless you plan to handle. Otherwise let it propagate.
