# Vite

The default bundler for new frontend apps. Dev server uses native ESM +
esbuild; production build uses Rollup.

## Setup

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev            # dev server with HMR
npm run build          # production bundle
npm run preview        # serve the build
```

## Key features

- Zero-config for React, Vue, Svelte, vanilla.
- Native ESM dev = fast cold start.
- Rollup for production = optimized output.
- Built-in TS, JSX, CSS modules, PostCSS.
- Import assets: `import logo from './logo.svg'`.

## Env vars

`import.meta.env.VITE_API_URL` — prefix env vars with `VITE_` to expose to
the client. Everything else stays server-only.

## When to reach for it

- New React/Vue/Svelte app.
- Migrating away from Webpack for developer speed.

## When to avoid it

- Node backend — Vite is browser-focused. Use tsup, tsx, or plain esbuild.
- Large legacy Webpack projects — migration cost isn't always worth it.

## Interview tips

- Dev = ESM. Build = Rollup. Two different behaviors — surprises can hide.
- `import.meta.env.MODE` = 'development' | 'production'.
