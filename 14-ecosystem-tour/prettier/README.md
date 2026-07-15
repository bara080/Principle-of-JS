# Prettier

Opinionated code formatter. Removes formatting from PR review.

## Setup

```bash
npm install -D prettier
echo '{ "singleQuote": true, "semi": false }' > .prettierrc.json
npx prettier . --write
```

## Editor integration

- Install the Prettier extension.
- Set as default formatter.
- Enable "format on save."

## With ESLint

Use `eslint-config-prettier` to disable ESLint rules that conflict with
Prettier. Do NOT use `eslint-plugin-prettier` — it slows lint runs.

```bash
npm install -D eslint-config-prettier
```

Add to your ESLint flat config:

```js
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  prettier,   // must be last
]
```

## Interview tips

- Prettier is style-only; not a linter.
- The debate about "no config" is a feature — teams stop bikeshedding.
- CI check: `prettier --check .` — fails without writing.
