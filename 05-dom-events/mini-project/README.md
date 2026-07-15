# Mini-Project — Delegated Todo List

Build a todo list with **one** click listener on the root `<ul>`. Add, toggle,
and delete rows are all handled through delegation. State persists to
`localStorage` under `todos.v1`.

## Files

```text
mini-project/
├── README.md
├── index.html       — minimal shell
├── index.js         — logic
└── index.test.js    — tests using node:test (jsdom-free where possible)
```

## Requirements

- One `click` listener at the root; use `event.target.closest('[data-id]')`
  to identify the row.
- Data lives in state (not the DOM). Render from state on each mutation.
- Persist state to `localStorage` under `todos.v1` after every mutation.
- On load, restore from `localStorage` if present.
- Guard against malformed persisted state — treat parse errors as empty state.

## Run

Open `index.html` in a browser, or `node --test 05-dom-events/mini-project/index.test.js`
for the logic tests (state layer only — DOM is exercised in the browser).
