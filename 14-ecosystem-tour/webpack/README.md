# Webpack

The bundler that shaped the modern JS ecosystem. Still runs a huge amount
of production code (Create React App, Next.js internally through v14).

## When you see it

- Any app scaffolded before ~2022.
- Advanced custom builds (Module Federation, complex code-splitting).
- Enterprise codebases with long-running Webpack configs.

## Core concepts

- **Entry** — start of the dependency graph.
- **Output** — where the bundle lands.
- **Loaders** — transform files (e.g. `babel-loader`, `css-loader`).
- **Plugins** — transform the compilation (`HtmlWebpackPlugin`, `DefinePlugin`).
- **Chunks** — split points; async imports produce separate bundles.

## Minimum config

```js
// webpack.config.mjs
export default {
  mode: 'production',
  entry: './src/index.js',
  output: { filename: 'bundle.js', path: new URL('./dist', import.meta.url).pathname },
  module: {
    rules: [{ test: /\.js$/, use: 'babel-loader' }],
  },
}
```

## When to avoid it

- New projects — Vite/esbuild are dramatically faster and simpler.
- Small libraries — use tsup/Rollup.

## Interview tips

- Understand `module.rules`, `resolve.alias`, and `optimization.splitChunks`.
- **Module Federation** — Webpack's answer to microfrontends. Ask before proposing.
