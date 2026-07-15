# npx

Run a package binary without installing it globally.

```bash
npx create-vite my-app
npx eslint src/
npx --package=@some/pkg some-bin
```

## When to reach for it

- One-shot scaffolding: `npx create-*`.
- Trying a tool without polluting global installs.
- Running a project-local binary in a script that doesn't have `node_modules/.bin` on PATH.

## When to avoid it

- Anything you'll run more than a handful of times per week. Install locally
  as a devDep instead — faster (no download), pinned version.

## Interview tips

- `npx` first fetches (unless the binary is already cached), then runs.
- Use `--no-install` to fail rather than fetch — safer for scripts.
