// Module 05 — mini-project — delegated todo list
// Stub — separate the state layer (pure, testable) from the DOM layer.

const STORAGE_KEY = 'todos.v1'

// ---- state layer (pure) ----------------------------------------------------

export function createStore(initial = []) {
  throw new Error('TODO: createStore — returns { add, toggle, remove, snapshot, subscribe }')
}

export function loadState(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveState(storage, items) {
  storage.setItem(STORAGE_KEY, JSON.stringify(items))
}

// ---- DOM layer -------------------------------------------------------------

if (typeof document !== 'undefined') {
  // Only run in a browser. Under `node --test`, this block is skipped.
  const list = document.querySelector('#list')
  const form = document.querySelector('#add')

  // TODO: wire up createStore + delegated click handler.
  list?.addEventListener('click', () => {})
  form?.addEventListener('submit', (e) => e.preventDefault())
}
