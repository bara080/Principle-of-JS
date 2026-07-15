// Minimal DOM binding — stub. Real IndexedDB layer left as an exercise.
// Domain logic lives in /src/domain/ and is fully tested.

import { computeStreak } from '../src/domain/streak.js'
import { today, toISODate } from '../src/domain/date.js'
import { validateImport } from '../src/domain/validate.js'

const list = document.querySelector('#list')

const state = {
  habits: [],   // { id, name, frequency, target, createdAt }
  entries: [],  // { id, habitId, date, count }
}

function render() {
  list.textContent = ''
  for (const habit of state.habits) {
    const stats = computeStreak(habit, state.entries.filter((e) => e.habitId === habit.id))
    const li = document.createElement('li')
    li.dataset.id = habit.id

    const name = document.createElement('span')
    name.className = 'name'
    name.textContent = habit.name

    const streak = document.createElement('span')
    streak.className = 'streak'
    streak.textContent = `🔥 ${stats.currentStreak} · best ${stats.longestStreak} · ${(stats.completionRate * 100).toFixed(0)}%`

    const check = document.createElement('button')
    check.textContent = 'done today'
    check.dataset.action = 'check'

    li.append(name, streak, check)
    list.append(li)
  }
}

document.querySelector('#add').addEventListener('submit', (e) => {
  e.preventDefault()
  const name = new FormData(e.target).get('name')?.toString().trim()
  if (!name) return
  state.habits.push({
    id: crypto.randomUUID(),
    name,
    frequency: 'daily',
    target: 1,
    createdAt: today(),
  })
  e.target.reset()
  render()
})

list.addEventListener('click', (event) => {
  const li = event.target.closest('[data-id]')
  if (!li) return
  const action = event.target.dataset.action
  if (action === 'check') {
    state.entries.push({
      id: crypto.randomUUID(),
      habitId: li.dataset.id,
      date: today(),
      count: 1,
    })
    render()
  }
})

document.querySelector('#export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'habits-export.json'; a.click()
  URL.revokeObjectURL(url)
})

document.querySelector('#import').addEventListener('change', async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const payload = JSON.parse(await file.text())
    const result = validateImport(payload)
    if (!result.ok) return alert(`Invalid import: ${result.error}`)
    state.habits = result.data.habits
    state.entries = result.data.entries
    render()
  } catch (err) {
    alert(`Import failed: ${err.message}`)
  }
})

render()
