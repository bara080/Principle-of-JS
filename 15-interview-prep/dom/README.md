# DOM & Events

## Common questions

**1. Event bubbling vs capturing?**
Capture: from `window` down to the target. Target: at the element.
Bubble: back up. Most listeners are attached to the bubble phase.

**2. Event delegation — what and why?**
One listener on an ancestor handles many descendants via `event.target.closest`.
Cheaper for large lists and survives dynamic content.

**3. `preventDefault` vs `stopPropagation`?**
`preventDefault` cancels the browser's default (form submit, link navigate).
`stopPropagation` stops the event from bubbling further.

**4. `innerHTML` vs `textContent`?**
`innerHTML` parses HTML — a common XSS vector. `textContent` sets literal text.

**5. Detecting a click outside a menu?**
Add a document-level listener; check `menu.contains(event.target)`.

## Common mistakes

- Using `innerHTML` with untrusted content.
- Forgetting to `preventDefault` on a form submit.
- Adding a listener in a mount but not removing on unmount → memory leak.

## Senior-level nuances

- **Passive listeners** — `{ passive: true }` promises not to call `preventDefault`;
  required for smooth touch scroll on mobile.
- **`once: true`** — auto-remove after one fire; useful for one-shots.
- **`AbortController` on `addEventListener`** — pass `signal` to attach a lifetime.

  ```js
  const ac = new AbortController()
  el.addEventListener('click', fn, { signal: ac.signal })
  ac.abort() // removes the listener
  ```
