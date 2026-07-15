# ESLint

Static analysis for JavaScript. Catches bugs Prettier can't.

## Minimum-viable setup (flat config, ESLint 9+)

```bash
npm install -D eslint @eslint/js
```

`eslint.config.mjs`:

```js
import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    languageOptions: { ecmaVersion: 2024, sourceType: 'module' },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'eqeqeq': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
]
```

Run: `npx eslint .`

## With TypeScript

```bash
npm install -D typescript-eslint
```

```js
import ts from 'typescript-eslint'
export default [
  ...ts.configs.recommendedTypeChecked,
  { languageOptions: { parserOptions: { project: './tsconfig.json' } } },
]
```

## Rules worth turning on

- `eqeqeq`, `no-var`, `prefer-const` — catch fundamentals-era bugs.
- `no-shadow` — prevents scope confusion.
- `no-throw-literal` — enforces `throw new Error(...)`.
- `no-restricted-imports` — block legacy modules.

## Integration

- **Editor**: install the ESLint extension; enable "fix on save."
- **CI**: `eslint . --max-warnings=0`.
- **Pre-commit**: `lint-staged` runs eslint only on changed files.

## Interview tips

- ESLint = semantic rules. Prettier = formatting. Use both.
- Flat config is the future — `.eslintrc.*` is deprecated.
