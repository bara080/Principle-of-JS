# 03 — Habit Tracker

An offline-first Progressive Web App. Track daily habits, compute streaks,
sync across tabs. No backend — storage lives in IndexedDB.

## What it does

- Add / edit / delete habits with a name, frequency (daily / weekly), goal.
- Check off habits day-by-day; the UI shows a calendar heatmap.
- Compute current streak, longest streak, and completion rate per habit.
- Works entirely offline — installable as a PWA.
- Syncs open tabs in real time via `BroadcastChannel`.

## Modules exercised

- **03 (OOP)** — `Habit`, `Entry`, `Streak` value objects.
- **04 (arrays/data-structures)** — streak computation, date math, aggregation.
- **05 (DOM/events)** — event delegation, form handling, keyboard shortcuts.
- **07 (JSON/validation)** — validate imports from JSON exports.
- **08 (errors)** — user-visible error boundary; storage failures shown, not swallowed.
- **09 (testing/performance)** — pure logic tested in Node; large-list rendering perf.

## Data model

```js
Habit  = { id, name, frequency: 'daily'|'weekly', target: 1..7, createdAt, archivedAt? }
Entry  = { id, habitId, date: 'YYYY-MM-DD', count: number }
```

## Architecture

- **`src/domain/`** — pure logic (streaks, aggregations, validation). Node-testable.
- **`src/storage/`** — IndexedDB wrapper with a small in-memory fallback for tests.
- **`src/ui/`** — DOM rendering + delegation.
- **`src/sync.js`** — `BroadcastChannel` for cross-tab updates.

## Running

```bash
cd 03-habit-tracker
# Any static server will do:
npx http-server public -p 5173
open http://localhost:5173
```

## Tests

```bash
node --test tests/
```

## Acceptance criteria

- **Streak logic** is pure and covered by tests.
- Adding a habit takes ≤50ms end-to-end (measured with `performance.now`).
- Rendering 500 habits with 90 days of entries takes ≤200ms first paint.
- Reloading the page restores everything from IndexedDB.
- Opening a second tab shows updates within 100ms.
- Export → import round-trip preserves all data.
- Corrupted IndexedDB record shows a clear error, doesn't crash the UI.

## Extensions

- Reminders via the Notification API + Push (needs a tiny worker).
- Cloud sync with conflict resolution.
- Import from Loop / HabitBull / etc.
- Chart.js-style charts (or roll your own SVG).

## What "done" looks like

- [ ] Streak calc correctness verified across DST changes.
- [ ] Two open tabs stay in sync.
- [ ] Lighthouse PWA score ≥ 90.
- [ ] Runs offline after first load.
