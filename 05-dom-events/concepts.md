# Concepts — DOM & Events

> Status: outline.

## 1. The DOM vs the HTML source

- HTML is text. The DOM is a live object model the browser builds from it.
- Once parsed, the DOM is what JavaScript can query and mutate — the source
  HTML is irrelevant except for reload.

## 2. Selection

```js
document.getElementById('root')           // one, by id
document.querySelector('.card.active')    // one, by CSS selector
document.querySelectorAll('.row')         // static NodeList of all matches
```

- `querySelectorAll` returns a static list (safe to iterate while mutating).
- `getElementsByClassName` returns a *live* list (can bite you in a loop).

## 3. Mutation

```js
el.textContent = user.name                 // safe — no HTML parsing
el.setAttribute('data-id', id)
el.classList.add('active')
el.append(childNode)                       // append DOM node
el.remove()                                // detach from parent
```

Never assign untrusted content to `innerHTML` — it interprets `<script>` and
`onerror=` attributes.

## 4. Events

```js
el.addEventListener('click', handler)
el.addEventListener('click', handler, { capture: true, once: true, passive: true })
el.removeEventListener('click', handler)
```

Phases:

1. **Capture** — event travels from `window` down to target.
2. **Target** — fires on the element that was clicked.
3. **Bubble** — event travels back up to `window`.

Most listeners run on bubble by default.

## 5. Event delegation

Attach one listener to a common ancestor; use `event.target.closest(selector)`
to identify which child was hit. Cheaper than one listener per child, and
survives dynamic content.

```js
list.addEventListener('click', (e) => {
  const item = e.target.closest('[data-id]')
  if (!item) return
  handle(item.dataset.id)
})
```

## 6. `preventDefault` and `stopPropagation`

- `preventDefault` — cancel the browser's default action (form submit, link
  navigation, checkbox toggle).
- `stopPropagation` — halt bubbling. Use sparingly — it hides events from
  ancestors that might legitimately want them.

## 7. `localStorage` / `sessionStorage`

- Both hold string-only key/value pairs.
- `localStorage` persists across sessions; `sessionStorage` clears on tab close.
- ~5MB quota. Use IndexedDB for large data.

## 8. Performance

- **Layout thrashing** — reading a layout property (`offsetHeight`) forces
  the browser to flush pending style/layout. Read all, then write all.
- **Batch DOM changes** — build a `DocumentFragment` and append once.
- **`requestAnimationFrame`** — for anything visual; syncs with paint.

## Security Considerations

- **XSS** — never `innerHTML` untrusted strings. Use `textContent` or DOM APIs.
- **`javascript:` URLs** — never accept them as `href` values.
- **CSP** — Content Security Policy blocks inline scripts by default in strict
  configurations.

## Common Interview Questions

1. Explain event delegation and when you'd use it.
2. Bubble vs capture phase.
3. `textContent` vs `innerHTML` vs `innerText`.
4. How would you detect a click outside a menu?
5. What's a memory leak from DOM listeners? Fix it.
