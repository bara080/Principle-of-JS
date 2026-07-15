# Rollup

The go-to bundler for JavaScript libraries. Tree-shaking-first, small output,
excellent for ESM.

## When to reach for it

- Publishing an npm package.
- Producing multi-format output (ESM + CJS + UMD).
- Building an SDK where bundle size matters.

## Minimum config

```js
// rollup.config.mjs
export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.mjs', format: 'es' },
    { file: 'dist/index.cjs', format: 'cjs' },
  ],
}
```

## Ecosystem

- **tsup** — a thin wrapper around esbuild that gives you Rollup-like output
  in one command. Simpler default for libraries.
- Vite uses Rollup under the hood for production builds.

## When to avoid it

- App bundling — Vite is better.
- Complex asset pipelines — Webpack has more plugins.

## Interview tips

- Rollup's `treeshake` produces the smallest ESM outputs.
- `input` can be an array or map for multi-entry builds.
