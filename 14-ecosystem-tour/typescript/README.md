# TypeScript

Static types for JavaScript. Catches a category of bugs at compile time.
Universal in modern professional codebases.

## Setup

```bash
npm install -D typescript
npx tsc --init
```

`tsconfig.json` (strict, modern):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noImplicitOverride": true,
    "noUncheckedIndexedAccess": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "declaration": true
  },
  "include": ["src"]
}
```

Run: `tsc` to compile, `tsc --noEmit` to type-check.

## What to learn first

1. `interface` vs `type` (both work; prefer `type` for unions/generics).
2. Utility types: `Partial`, `Required`, `Pick`, `Omit`, `Record`, `ReturnType`.
3. Discriminated unions for state modeling.
4. Generics — start with `function first<T>(arr: T[]): T | undefined`.
5. `as const` and `satisfies` for literal-narrowing.

## Type-only imports

```ts
import type { User } from './types.js'
```

Erased at build — no runtime cost.

## Interview tips

- `unknown` beats `any` — forces narrowing.
- `noUncheckedIndexedAccess` is the safety net beginners are missing.
- Generics are for constraints, not decoration — if `T` never varies, you don't need it.
