# Project 02 — Task Scheduler

A production-shaped in-process scheduler. Cron-like syntax, priorities,
retries, backoff, cancellation, per-task timeouts.

## API

```js
const scheduler = createScheduler()

scheduler.every('* * * * *', () => reindex())          // every minute (cron)
scheduler.at('2026-08-01T09:00:00Z', () => sendReport())
scheduler.debounced('search', 300, (q) => reindex(q))  // named debounce

scheduler.enqueue(fn, {
  priority: 'high',
  retry: { attempts: 3, base: 500 },
  timeoutMs: 5000,
})

scheduler.stop()
```

## Acceptance criteria

- Uses a priority queue (min-heap) for scheduling.
- Retries with exponential backoff + jitter.
- Cancellable via `AbortController`.
- Every task is instrumented — `scheduler.stats()` returns queue depth, failures, runtimes.

Run: `node --test 13-advanced-projects/project-02-task-scheduler/tests/`.
