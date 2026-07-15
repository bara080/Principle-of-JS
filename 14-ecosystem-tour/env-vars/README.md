# Environment Variables

The seam between your code and its environment. Get it right or leak your
secrets to the bundle.

## Node

```bash
# .env (git-ignored)
PORT=3000
DATABASE_URL=postgres://…
```

Load with Node's built-in `--env-file`:

```bash
node --env-file=.env server.js
```

Or the `dotenv` package for older setups.

Read in code:

```js
const port = Number.parseInt(process.env.PORT, 10)
if (!Number.isFinite(port)) throw new Error('PORT required')
```

**Always parse and validate at boot.** The moment a bad env var hits your
request handler, debugging is 10x harder.

## Vite / Next / bundlers

```bash
# .env.local
VITE_API_URL=…                  # Vite
NEXT_PUBLIC_API_URL=…           # Next.js — exposed to browser
```

Everything not prefixed stays server-only.

## Rules

1. `.env*` are git-ignored except `.env.example` (a public template).
2. Never log env vars — one careless `console.log(process.env)` leaks
   everything to your log aggregator.
3. Anything in a browser bundle is public. `SECRET_KEY` there is not secret.
4. Parse and default at process start — fail loudly.

## Secrets management in production

- Vercel / Netlify / CI providers all have env-var UIs.
- Cloud platforms (AWS Secrets Manager, GCP Secret Manager) for rotated secrets.
- Never bake secrets into an image or artifact.

## Interview tips

- `process.env.NODE_ENV` is set by tooling — not free money. Coerce to a
  known enum.
- Bundlers `DefinePlugin` inline env vars at build time. Changes require rebuild.
