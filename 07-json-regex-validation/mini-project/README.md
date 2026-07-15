# Mini-Project — Tiny Schema Library

Build a Zod-inspired schema library with a fluent API. Each schema exposes
`.parse(input)` returning `{ ok, data | errors }`.

## API sketch

```js
import { s } from './index.js'

const User = s.object({
  email: s.string().email(),
  age: s.number().int().min(13),
  role: s.enum(['guest', 'customer', 'admin']),
  bio: s.string().max(280).optional(),
})

const result = User.parse(rawInput)
```

## Requirements

- `.parse(input)` returns `{ ok: true, data }` or `{ ok: false, errors }`.
- Errors are `{ path: string[], message: string }`.
- Never throw on user input.
- `.optional()` allows `undefined`; `.nullable()` allows `null`.
- Refinements: `.refine(fn, message)` for custom checks.

## Run

```bash
node --test 07-json-regex-validation/mini-project/index.test.js
```
