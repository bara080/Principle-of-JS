# Cheatsheet — Testing & Performance

## Test skeleton

```js
import { describe, test, before, after, mock } from 'node:test'
import assert from 'node:assert/strict'

describe('feature', () => {
  before(() => {})
  after(() => {})

  test('happy path', () => {
    assert.equal(actual, expected)
  })

  test('rejects invalid input', () => {
    assert.throws(() => fn(null), TypeError)
  })

  test('async', async () => {
    await assert.rejects(promise, /timeout/)
  })
})
```

## Mocks

```js
const spy = mock.fn((x) => x * 2)
spy(3)
assert.equal(spy.mock.calls.length, 1)
assert.equal(spy.mock.calls[0].result, 6)
```

## Fake timers

```js
mock.timers.enable({ apis: ['setTimeout'] })
mock.timers.tick(500)
mock.timers.reset()
```

## Debounce / throttle

```js
const debounce = (fn, ms) => {
  let t
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms) }
}

const throttle = (fn, ms) => {
  let last = 0
  return (...a) => {
    const now = Date.now()
    if (now - last >= ms) { last = now; fn(...a) }
  }
}
```

## Perf timers

```js
const t = performance.now()
work()
console.log(`${(performance.now() - t).toFixed(2)}ms`)
```

## Interview tips

- Prefer `describe` per module, `test` per behavior.
- Fake timers are the answer for testing anything with `setTimeout` in it.
- Debounce fires after silence; throttle fires immediately then locks out.
