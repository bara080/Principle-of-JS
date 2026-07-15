# npm

The default package manager for Node. Alternatives: `pnpm` (fast, disk-efficient
via content-addressed store), `yarn` (Berry version is very different from Classic).

## Commands you'll use daily

```bash
npm init -y                     # scaffold package.json
npm install pkg                 # add runtime dep
npm install -D pkg              # add dev dep
npm install -g pkg              # global (avoid — prefer npx)
npm install --save-exact pkg    # pin exact version (infra deps)
npm uninstall pkg
npm outdated                    # what's behind
npm update                      # update within ranges
npm run <script>                # from package.json scripts
npm ci                          # deterministic install (use in CI)
npm audit                       # vuln scan
npm publish                     # ship a package
```

## When to reach for pnpm instead

- Monorepos — pnpm's workspaces + hoisting model is cleaner.
- Disk usage matters — pnpm hard-links from a global store.
- You want deterministic hoisting — pnpm avoids the "phantom dependency" issue.

## Lockfile

`package-lock.json` pins the exact resolved dependency tree. Commit it.
`npm ci` reads it strictly; `npm install` may update it.

## Interview tips

- `npm ci` in CI, `npm install` locally. Different behaviors.
- Global installs are usually a smell — use `npx` for one-shot invocations.
- `save-exact` for anything that could silently break your build.
