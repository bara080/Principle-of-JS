# Mini-Project — Publish a Package

Take an existing utility (the Module 01 order-processor, the Module 02 toolkit,
whatever you built) and ship it as a real package.

## Deliverables

- Convert to TypeScript (`.ts` sources, `.d.ts` types shipped).
- Add ESLint + Prettier configs. `npm run lint` succeeds.
- Vitest or `node --test` for tests. `npm test` succeeds.
- `package.json` with `type`, `main`, `module`, `types`, `exports`, `engines`,
  `scripts`.
- Build with tsup or Vite: output both ESM and CJS.
- README with install, usage, and API.
- CI stub — `.github/workflows/ci.yml` running lint + test on push.

## Requirements

- `npm pack` produces a tarball that installs and imports in a fresh Node repl.
- `import { … } from 'my-pkg'` works.
- Types resolve in a downstream TS consumer.

Run: adjust to whichever runner you settle on.

## Why this matters

Every "utility PR" you write in a real job hits this pipeline. Doing it end-to-end
once demystifies the whole tooling story.
