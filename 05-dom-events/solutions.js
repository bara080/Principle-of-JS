// Module 05 — solutions
// DOM code — assumes a document is present (browser or JSDOM).

export function bindCounter(buttonEl, displayEl) {
  let count = 0
  const update = () => { displayEl.textContent = String(count) }
  update()
  buttonEl.addEventListener('click', () => { count++; update() })
  return {
    reset: () => { count = 0; update() },
    read: () => count,
  }
}

export function bindTodoList(root) {
  const state = { items: [] }

  const render = () => {
    root.textContent = ''
    for (const todo of state.items) {
      const li = document.createElement('li')
      li.dataset.id = todo.id
      li.textContent = todo.text
      if (todo.done) li.classList.add('done')
      root.append(li)
    }
  }

  root.addEventListener('click', (event) => {
    const li = event.target.closest('[data-id]')
    if (!li) return
    const todo = state.items.find((t) => t.id === li.dataset.id)
    if (todo) todo.done = !todo.done
    render()
  })

  return {
    add(text) {
      state.items.push({ id: crypto.randomUUID(), text, done: false })
      render()
    },
    remove(id) {
      state.items = state.items.filter((t) => t.id !== id)
      render()
    },
    snapshot: () => structuredClone(state.items),
  }
}
