# Capstone Projects

Five production-shape projects that, together, exercise every module in this
repo. Pick two to complete for a portfolio. Pick all five if you're preparing
for senior interviews.

Each project is deliberately non-trivial — enough surface area to force
real engineering decisions (error handling, retries, cancellation, testing,
packaging, observability). None of them use a framework by default; you can
add one later, but the point is to see the raw shape of the problem first.

## The five projects

| # | Project              | Type            | Modules exercised                   |
|---|----------------------|-----------------|--------------------------------------|
| 01 | **Jobs API**         | Node HTTP service | 1, 2, 3, 6, 7, 8, 9, 10             |
| 02 | **Realtime Chat**    | WS server + client | 2, 5, 6, 8, 9                       |
| 03 | **Habit Tracker**    | Offline-first PWA | 3, 4, 5, 7, 8, 9                    |
| 04 | **Markdown CLI**     | Node CLI tool    | 1, 2, 4, 7, 8, 9, 10                 |
| 05 | **Admin Dashboard**  | Data-heavy SPA   | 3, 4, 5, 6, 9                        |

Together they cover every learning module 01–10 plus most of 14 (ecosystem).

## Shared layout

Each project follows the same shape:

```text
NN-project/
├── README.md               — spec, acceptance criteria, run instructions
├── package.json            — deps, scripts
├── src/                    — implementation
├── tests/                  — node:test (or a browser runner where relevant)
├── docs/                   — decisions, architecture notes
└── .env.example            — required env vars
```

Some also ship a `public/` (browser assets) or `bin/` (CLI entry).

## Level guidance

- **First capstone:** Markdown CLI or Habit Tracker — smaller surface,
  self-contained.
- **Second capstone:** Jobs API — introduces HTTP, auth, persistence.
- **Third capstone:** Admin Dashboard — brings data + UI + performance together.
- **Stretch:** Realtime Chat — network protocols, backpressure, presence.

## Grading rubric

Each project has a checklist in its README. Rough guide:

- ✅ **Feature-complete** — every acceptance criterion met.
- ✅ **Tested** — happy path + failure modes covered.
- ✅ **Handles bad input** — never crashes on malformed data.
- ✅ **Observable** — logs, timings, or metrics at boundaries.
- ✅ **Documented** — README covers install, use, extend.
- ✅ **Shipped** — deployable (Docker or plain `node`) or publishable (`npm pack`).

Hit five of six and it's portfolio-quality.

## Common infrastructure

All projects target Node 20+. All use ESM. Testing uses `node:test` unless
noted (Habit Tracker + Admin Dashboard include a browser test runner because
they're UI-heavy).

None require external services by default:

- **Jobs API** ships an in-memory store; swap for SQLite when you want persistence.
- **Realtime Chat** uses `ws` (only third-party dep across the five projects).
- **Habit Tracker** uses IndexedDB in the browser.
- **Markdown CLI** is dependency-free.
- **Admin Dashboard** mocks its API against fixtures.

## Recommended order

If you want a natural ramp:

1. Markdown CLI       (pure JS, no I/O beyond files — warm-up)
2. Habit Tracker      (adds DOM, storage, offline)
3. Jobs API           (adds HTTP, auth, testing at scale)
4. Admin Dashboard    (adds fetch, pagination, virtualization)
5. Realtime Chat      (adds WebSockets, backpressure, presence)

## Portfolio tips

- Ship each with a live demo link (Vercel/Fly.io/Railway) where feasible.
- Screenshot the UI, embed in the README.
- Include a "What I'd do next" section — signals seniority.
- Track your Big-O for hot paths in the Admin Dashboard.
