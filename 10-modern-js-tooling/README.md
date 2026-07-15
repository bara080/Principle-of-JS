# Module 10 — Modern JS & Tooling

> The parts of JavaScript that make it a professional toolchain — modules,
> packages, TypeScript, bundlers, linters, formatters.

## Learning Objectives

- Use ESM `import`/`export` fluently; understand CommonJS interop.
- Read `package.json` and pick fields you care about (`type`, `exports`,
  `engines`, `scripts`).
- Understand semver and lockfiles.
- Configure ESLint + Prettier for a project.
- Convert a JS project to TypeScript incrementally.
- Bundle for a browser with Vite.

## Why This Topic Matters

Every job needs you to ship, not just to write scripts. Modules, bundlers, and
type systems are the difference between "runs on my machine" and "runs on
production." Type systems in particular catch a category of bugs that no
amount of testing will find.

## Where It Is Used In Production

- **Every** new Node service and web app.
- CI runs the linter, formatter, type-check, and test suite on every PR.
- Design system libraries publish as ESM + CJS + type definitions.
- Monorepos organize the whole company's code.

## Prerequisites

Modules 01–09.

## Skills Gained

- Setting up a new project from zero.
- Reading `package.json` and knowing which fields matter for which consumer.
- Confidence in the TypeScript type system's basics.

## Estimated Completion Time

- Reading: 90 min · Exercises: 3 hr · Mini-project: 2 hr.

## Common Mistakes

1. Publishing without `"type": "module"` and wondering why ESM imports break.
2. Skipping `npm install --save-exact` on infrastructure — flaky pinning.
3. Mixing default and named exports carelessly.
4. Committing `node_modules/` (`.gitignore` it).
5. Ignoring `engines` — CI runs on Node 18 while you're on 22.

## Best Practices

- `"type": "module"` unless you have a hard reason to stay on CommonJS.
- Use ESLint + Prettier from day one; enforce in CI.
- Add `"engines"` and pin at least the minor version.
- TypeScript from the start on new projects. It's cheaper than adding later.

## Mini-Project Overview

**`mini-project/`** — take Module 01's order-processor mini-project and convert
it into a proper published package: strict TypeScript, ESLint, Prettier, Vitest
tests, ESM output. Ship-quality.

## Recommended Resources

- Node docs — `package.json` reference.
- <https://vite.dev/> — bundler.
- <https://www.typescriptlang.org/docs/handbook/> — the handbook.
- <https://tsdx.io/> or <https://tsup.egoist.dev/> for library scaffolds.
