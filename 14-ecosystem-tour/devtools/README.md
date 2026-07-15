# Chrome DevTools

The other editor. If you build for the browser, you'll spend hours here.

## Panels worth mastering

- **Elements** — DOM tree, styles, computed values, box model.
- **Console** — REPL, filters, `$0` (last-selected element).
- **Sources** — breakpoints, snippets, workspace overrides.
- **Network** — waterfall, headers, timing, throttling.
- **Performance** — flame graph, main-thread work, layout events.
- **Memory** — heap snapshots, allocation timeline.
- **Application** — localStorage, cookies, service workers.
- **Lighthouse** — automated perf/accessibility audit.

## Console power moves

```js
$('.card')            // querySelector shorthand
$$('.row')            // querySelectorAll shorthand
$0                    // last-selected element in Elements panel
copy(value)           // copy to clipboard
monitor(fn)           // log every call to fn
monitorEvents(el, 'click')   // log all matching events
```

## Sources

- **Workspaces** — map a source tree to a domain so DevTools edits your files.
- **Overrides** — replace a live response with a local file (patch prod without shipping).
- **Conditional breakpoints** — right-click a line number, set a condition.
- **Logpoints** — same, but `console.log`-only. No pausing.

## Network

- **Preserve log** — survives page navigations.
- **Throttle** — simulate slow 3G. Test the empty state too.
- **Copy → cURL / fetch** — reproduce requests instantly.

## Performance

1. Record.
2. Look for long tasks (red triangles).
3. Zoom in. Find the flame you don't recognize.
4. Fix.

## Interview tips

- Know how to record a Performance trace and identify a slow function.
- `$0` and `monitor()` are underrated party tricks.
