# Project 01 — Toast Notification System

Build a stackable toast/notification system. Auto-dismiss with pause-on-hover,
manual dismiss button, `success` / `error` / `info` variants, `aria-live`
politeness.

## API

```js
const toast = createToaster({ root: '#toasts', defaultTimeout: 4000 })
toast.show({ variant: 'success', message: 'Saved' })
const id = toast.show({ variant: 'error', message: 'Network', timeout: 0 }) // sticky
toast.dismiss(id)
toast.clear()
```

## Acceptance criteria

- New toasts stack; oldest at bottom.
- Timeout of `0` disables auto-dismiss.
- Hovering a toast pauses its timer; leaving resumes.
- `aria-live="polite"` on the region.
- One click listener on the container handles all dismiss buttons via delegation.

Run: `node --test 12-intermediate-projects/project-01-toast/tests/`.
