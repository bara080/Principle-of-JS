# Babel

A JavaScript-to-JavaScript transpiler. Historically the way to use ES2015+
before browsers/Node caught up.

## Status in 2026

Mostly historical. Modern projects use:

- **esbuild** / **swc** — 10–100x faster; handles TS + JSX in one step.
- **TypeScript compiler** for type stripping.

You still see Babel in:

- Legacy React apps.
- Jest's default transformer (via `babel-jest`).
- Specific transforms (macros, PostCSS-like pipelines).

## Minimum config

`babel.config.json`:

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": { "esmodules": true } }],
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

## When to reach for it

- Adding a compile-time macro (`babel-plugin-transform-react-remove-prop-types`).
- Maintaining a legacy Create-React-App project.

## When to avoid it

- New projects. Choose Vite (esbuild) or tsup (esbuild) instead.

## Interview tips

- "Transpile" = convert to different syntax; "compile" = convert to a
  different form (bytecode, machine code). Babel transpiles.
- Understanding Babel is background context for why modern tooling exists.
