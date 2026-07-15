# Debugging

Habits and tools that turn "I don't understand what's happening" into "I know
exactly what's happening" quickly.

## First reflex

Read the stack trace. Actually read it. Bottom-up. Find the *last line in
your own code*.

## Node

```bash
node --inspect-brk file.js       # pause at start, attach Chrome DevTools
# In VS Code: F5 with a JavaScript Debug Terminal
```

Then set breakpoints in the source.

## Chrome DevTools

- **Sources** panel — breakpoints, logpoints, step through.
- **Conditional breakpoints** — right-click a line number.
- **Logpoints** — like `console.log` without editing the file.
- **Blackboxing** — hide framework frames in the call stack.
- **Async stack traces** — Node 12+ / Chrome show promise chains.

## Console tricks

```js
console.table(items)                 // tabular
console.group('req'); ...; console.groupEnd()
console.dir(obj, { depth: null })
console.time('label'); ...; console.timeEnd('label')
console.trace()
```

## Networking

- DevTools → Network → Preserve log across navigations.
- `console.time` before and after `fetch` for quick timing.
- Copy → `Copy as fetch` reproduces a request in code.

## Print statements — the honest truth

- `console.log` beats "clever" tools when you're 2 hours in.
- Add prefixes: `console.log('[cart]', total)`.
- Remove before merging.

## Interview tips

- Learn one debugger properly (VS Code + Node). Interview candidates who
  can breakpoint through unfamiliar code are memorable.
- `debugger` statement pauses when DevTools is attached.
