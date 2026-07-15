// Project 01 — reference solution
export function createCounter({ initial = 0, step = 1 } = {}) {
  let value = initial
  const listeners = new Set()
  const notify = () => { for (const fn of listeners) fn(value) }
  return {
    increment() { value += step; notify() },
    decrement() { value -= step; notify() },
    reset() { value = initial; notify() },
    read: () => value,
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}
