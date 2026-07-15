# Parcel

Zero-config bundler. Point it at an HTML file, it builds the whole thing.

## Setup

```bash
npm install -D parcel
npx parcel index.html            # dev server
npx parcel build index.html      # production
```

Parcel figures out that your HTML references JS, CSS, images, and builds them all.

## When to reach for it

- Rapid prototypes and demos.
- Teaching / small projects.
- HTML-first sites (docs, landing pages).

## When to avoid it

- Serious apps — Vite has a bigger ecosystem.
- Fine-grained control over the build graph.

## Interview tips

- Parcel's zero-config is powerful for one-shot builds; less common in senior
  interviews than Vite/Webpack.
