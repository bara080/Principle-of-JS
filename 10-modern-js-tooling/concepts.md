# Concepts — Modern JS & Tooling

> Status: outline. Deeper coverage lives in Module 14 (ecosystem).

## Modules — ESM vs CJS

- **ESM** (`import`/`export`) — the standard. Statically analyzable.
- **CJS** (`require`/`module.exports`) — the Node legacy. Dynamic.
- In `package.json`, `"type": "module"` makes `.js` files ESM.
- Use `.mjs` / `.cjs` to force a particular loader.

Interop rules (Node):

- ESM can `import` CJS — the default export is `module.exports`, named exports
  are the top-level assigned properties.
- CJS can `require` **static** ESM only via `.cjs`-side `await import()`.

## `package.json` fields that matter

```json
{
  "name": "my-pkg",
  "version": "1.2.3",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "engines": { "node": ">=20" },
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "test": "vitest",
    "lint": "eslint ."
  }
}
```

## Semver

- `MAJOR.MINOR.PATCH`.
- `^1.2.3` — up to <2.0.0.
- `~1.2.3` — up to <1.3.0.
- Lockfile (`package-lock.json`, `pnpm-lock.yaml`) pins the exact tree used
  in CI.

## TypeScript in one page

- `interface User { id: string; email: string }` — record type.
- `type Result<T> = { ok: true; data: T } | { ok: false; error: string }` — union.
- Generics: `function first<T>(arr: T[]): T | undefined`.
- `satisfies` — narrow a type without widening.
- `as const` — literal-narrow at write-time.

## Bundlers

- **Vite** — the current default for apps.
- **tsup** — great for libraries.
- **esbuild** — the transformer both use under the hood.
- **Webpack** — legacy, still common; understand `entry`, `output`, `resolve`, `loaders`.

## Linters & formatters

- **ESLint** — semantic rules, catches bugs.
- **Prettier** — formatting only; opinionated, hands-off.
- Run both in CI. Auto-fix in editor on save.

## Common Interview Questions

1. Difference between `import` and `require`.
2. What does `"type": "module"` do?
3. Explain `^` in a package.json version.
4. Why do we commit `package-lock.json`?
5. When is TypeScript worth the cost?
