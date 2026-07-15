# 05 — Admin Dashboard

A data-heavy admin panel: virtualized table, server-shaped pagination, multi-column
sort, faceted filtering, real-time totals. No framework — vanilla DOM plus a small
reactive store.

## What it does

- Loads ~10,000 orders from a mocked API (fixtures + delay).
- Renders only the visible rows via windowed virtualization (60 FPS on a
  200,000-item list).
- Sort by any column, ascending/descending, multi-key.
- Filter by status enum, date range, revenue range, free-text on customer name.
- KPI cards update as filters change.
- Deep-links filter/sort state to the URL — reload restores everything.
- Handles slow API responses gracefully: skeleton loaders, retry, request cancellation.

## Modules exercised

- **03 (OOP)** — `OrderStore`, `Filter` value objects.
- **04 (arrays/data)** — sort comparators, index-based lookups.
- **05 (DOM/events)** — delegation across many rows, keyboard nav.
- **06 (async)** — fetch, cancellation, retries.
- **09 (performance)** — virtualization, memoized filters, debounced search.

## Architecture

```text
src/
├── store.js         — reactive store (subscribe/emit)
├── filter.js        — pure filter/sort logic
├── api.js           — mocked fetch client
├── virtual-list.js  — windowed renderer
└── ui/              — DOM binding
tests/               — pure logic tested with node:test
```

## Running

```bash
cd 05-admin-dashboard
npx http-server public -p 5173
open http://localhost:5173
```

## Tests

```bash
node --test tests/
```

## Acceptance criteria

- Scrolling a 200k-row list holds ≥ 55 FPS in Chrome DevTools' Performance panel.
- Filter changes debounced at 150ms.
- URL reflects `?status=paid&sort=total:desc&q=ada` after any filter change.
- Loading state visible for slow responses; skeleton doesn't push layout.
- Cancels the previous fetch when a new filter is applied.

## Extensions

- CSV export.
- Column configurator (show/hide, reorder).
- Saved views.
- Real backend (integrates with Project 01's Jobs API pattern).

## What "done" looks like

- [ ] Performance budget met on a 200k-row fixture.
- [ ] URL-driven state fully restores UI.
- [ ] Every user action is testable (pure store + pure filter).
- [ ] Documented perf traces in `docs/`.
