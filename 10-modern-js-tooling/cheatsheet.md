# Cheatsheet — Modern JS & Tooling

## Modules

```js
// ESM
import { util } from './util.js'
import { default as express } from 'express'
export const x = 1
export default fn

// CJS
const { util } = require('./util')
module.exports = { x: 1 }
```

## Destructuring / spread / rest recap

```js
const { a, b: renamed = 1, ...rest } = obj
const [first, ...tail] = arr
const merged = { ...a, ...b }
const args = [1, 2, 3]
fn(...args)
```

## Optional / nullish

```js
user?.address?.city
onDone?.()
value ?? defaultValue
```

## TypeScript quick reference

```ts
interface User { id: string; name?: string }
type Role = 'guest' | 'admin'
type Result<T, E = string> = { ok: true; data: T } | { ok: false; error: E }

function first<T>(arr: T[]): T | undefined { return arr[0] }

const config = { port: 3000, host: 'localhost' } as const
```

## npm / pnpm commands

```bash
npm init -y
npm install pkg              # runtime
npm install -D pkg           # devDep
npm install -g pkg           # global
npm run <script>
npx some-tool                # one-shot without install

pnpm install                 # faster, disk-efficient alt
```

## Lockfiles

- `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (yarn).
- Commit them. CI uses `npm ci` / `pnpm install --frozen-lockfile`.

## Interview tips

- `"type": "module"` = ESM by default.
- Lockfiles pin the whole transitive tree, not just your top-level deps.
- Semver `^` = same major.
