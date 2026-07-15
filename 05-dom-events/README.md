# Module 05 — DOM & Events

> The DOM is the runtime state of the page. Events are the language for
> reacting to changes. Learn both, and you can build any UI without a framework.

## Learning Objectives

- Select elements with `getElementById`, `querySelector`, and `querySelectorAll`.
- Mutate the DOM safely — `textContent`, attributes, `classList` (never
  `innerHTML` on untrusted data).
- Attach and remove event listeners; understand capture, target, and bubble phases.
- Implement event delegation for lists that grow dynamically.
- Persist state to `localStorage` / `sessionStorage`.
- Read the DOM performantly — avoid layout thrashing.

## Why This Topic Matters

Every React/Vue/Svelte app renders to the DOM eventually. When a framework
misbehaves, you have to reason at the DOM level. Interviews frequently ask
you to build a small interactive UI without a framework — and correctness
depends on knowing the DOM, not the framework.

## Where It Is Used In Production

- Vanilla widgets embedded in server-rendered pages (Rails, Django, PHP).
- Framework escape hatches — `useRef` in React → direct DOM access.
- Browser extensions, Electron apps, Figma plugins.
- Bookmarklets, userscripts, analytics tags.

## Prerequisites

Modules 01–02. Basic HTML/CSS.

## Skills Gained

- Building a UI without a framework.
- Diagnosing "why is my React ref null?" and similar leaks.
- Understanding what a framework does under the hood.

## Estimated Completion Time

- Reading: 60 min · Exercises: 3 hr · Mini-project: 2 hr.

## Common Mistakes

1. `innerHTML = userInput` — XSS pipeline.
2. Adding a listener in a component and forgetting to remove it → memory leak.
3. Reading layout (`offsetHeight`) inside a write loop — forced synchronous layout.
4. `element.style.setProperty` in a `for` loop — batch by toggling a CSS class.
5. `document.write` — legacy, breaks async loading.
6. Forgetting `preventDefault()` on a form submit → full page reload.

## Best Practices

- One event listener per widget via delegation, not one per row.
- Assign `textContent` for text; `element.append(node)` for children; never
  concatenate HTML strings from untrusted sources.
- Batch DOM writes; wrap animation work in `requestAnimationFrame`.
- Prefer `dataset` for embedding state on elements.

## Mini-Project Overview

**`mini-project/`** — an event-delegated todo list. One click listener for the
whole list handles add / toggle / delete. State persisted to `localStorage`.
Includes JSDOM-based tests running in Node.

## Recommended Resources

- MDN — DOM: <https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model>
- MDN — Event reference.
- WHATWG — DOM Living Standard (dense but authoritative).
