// Validate imported data — untrusted, could be attacker-controlled.

const FREQUENCIES = new Set(['daily', 'weekly'])

export function isValidHabit(h) {
  return (
    h && typeof h === 'object'
    && typeof h.id === 'string' && h.id.length > 0
    && typeof h.name === 'string' && h.name.trim().length > 0
    && FREQUENCIES.has(h.frequency)
    && Number.isInteger(h.target) && h.target >= 1 && h.target <= 7
    && typeof h.createdAt === 'string'
  )
}

export function isValidEntry(e) {
  return (
    e && typeof e === 'object'
    && typeof e.id === 'string' && e.id.length > 0
    && typeof e.habitId === 'string' && e.habitId.length > 0
    && typeof e.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date)
    && Number.isInteger(e.count) && e.count >= 0
  )
}

export function validateImport(payload) {
  if (!payload || typeof payload !== 'object') return { ok: false, error: 'not an object' }
  const habits = Array.isArray(payload.habits) ? payload.habits.filter(isValidHabit) : []
  const entries = Array.isArray(payload.entries) ? payload.entries.filter(isValidEntry) : []
  if (habits.length === 0 && entries.length === 0) {
    return { ok: false, error: 'no valid records found' }
  }
  return { ok: true, data: { habits, entries } }
}
