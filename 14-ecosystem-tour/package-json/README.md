# package.json

The manifest. Every field means something to some tool.

## Minimum

```json
{
  "name": "my-pkg",
  "version": "1.0.0",
  "private": true
}
```

## Fields that affect consumers

| Field         | Effect                                                                 |
| ------------- | ---------------------------------------------------------------------- |
| `type`        | `"module"` = ESM by default. Otherwise CJS.                            |
| `main`        | CJS entry point (legacy).                                              |
| `module`      | ESM entry point (Rollup/Webpack).                                      |
| `types`       | TypeScript types entry.                                                |
| `exports`     | Modern gate — replaces `main`/`module`/`types`. Use this on new libs.  |
| `bin`         | CLI entry points; installed to `node_modules/.bin`.                   |
| `engines`     | Node version required. CI honors it via `npm ci --engine-strict`.    |
| `files`       | Whitelist of files included in the tarball.                            |
| `sideEffects` | `false` = tree-shaking safe. Explicit list = only these have side effects. |

## Modern `exports`

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./utils": {
      "import": "./dist/utils.mjs"
    }
  }
}
```

Consumers can only import paths you list here. Everything else is 404 — a
feature, not a bug.

## Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsup src/index.ts",
    "test": "vitest",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build && npm test"
  }
}
```

`prepublishOnly` runs before `npm publish` — great for guardrails.

## Interview tips

- `exports` supersedes `main`/`module`. Modern libs use it.
- `sideEffects: false` unlocks aggressive tree-shaking.
- `engines` + `--engine-strict` prevents "works on my machine."
