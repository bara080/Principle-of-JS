// Tiny reactive store — set / subscribe / snapshot.

export function createStore(initial) {
  let state = initial
  const listeners = new Set()

  return {
    getState: () => state,
    setState(patch) {
      state = typeof patch === 'function' ? patch(state) : { ...state, ...patch }
      for (const fn of listeners) fn(state)
    },
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}
