let nextId = 1

export function createStore() {
  let toasts = []
  const listeners = new Set()
  const notify = () => { for (const fn of listeners) fn(toasts) }

  return {
    show({ variant = 'info', message = '', timeout = 4000 } = {}) {
      const id = nextId++
      toasts = [...toasts, { id, variant, message, timeout, createdAt: performance.now() }]
      notify()
      return id
    },
    dismiss(id) {
      toasts = toasts.filter((t) => t.id !== id)
      notify()
    },
    clear() { toasts = []; notify() },
    snapshot: () => [...toasts],
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) },
  }
}
