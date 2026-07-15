# Mini-Project — Result Type + Error Hierarchy

Build a small errors-as-data toolkit plus a typed error hierarchy for a
back-end service.

## API

```js
import { ok, err, wrap, AppError, NotFoundError, ValidationError } from './index.js'

async function loadUser(id) {
  if (!isValidUuid(id)) return err(new ValidationError('bad uuid'))
  const user = await db.users.find(id)
  if (!user) return err(new NotFoundError(`user ${id}`))
  return ok(user)
}

// Convert throwing code to Result form.
const result = await wrap(() => risky())
```

## Requirements

- `AppError` has `name`, `code`, `status`, `cause`, and a working `toJSON`.
- `NotFoundError` (404), `ValidationError` (400), `AuthError` (401) subclasses.
- `wrap(fn)` runs `fn` and returns `{ok, data} | {ok:false, error}`.
- `ok` / `err` constructors, plus type guards.

Run: `node --test 08-error-handling-debugging/mini-project/index.test.js`.
