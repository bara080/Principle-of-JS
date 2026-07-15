# Module 14 — Ecosystem Tour

Practical guides to the tools that show up on every real project. One folder
per topic. Each guide follows the same shape:

- **What it is**
- **When to reach for it**
- **When to avoid it**
- **Minimum-viable setup**
- **What to remember for interviews**

## Layout

```text
14-ecosystem-tour/
├── README.md          — you are here
├── nodejs/
├── npm/
├── package-json/
├── npx/
├── eslint/
├── prettier/
├── babel/
├── vite/
├── webpack/
├── rollup/
├── parcel/
├── typescript/
├── git-workflow/
├── env-vars/
├── debugging/
├── vscode/
└── devtools/
```

## Suggested reading order

1. `nodejs` → `npm` → `package-json` → `npx` (foundation)
2. `eslint` + `prettier` (quality baseline for any repo)
3. `typescript` (the type layer)
4. `vite` (the modern bundler for apps) — skim `webpack`, `rollup`, `parcel`
   for comparison
5. `babel` (mostly historical context now)
6. `env-vars`, `git-workflow` (day-to-day)
7. `debugging`, `vscode`, `devtools` (productivity)

## Path recommendations

- **Backend Node** — `nodejs`, `npm`, `package-json`, `env-vars`, `typescript`.
- **React app** — `vite`, `typescript`, `eslint`, `prettier`, `devtools`.
- **Library author** — `typescript`, `rollup` or `tsup`, `package-json`
  (`exports` field is critical), `vitest`.
