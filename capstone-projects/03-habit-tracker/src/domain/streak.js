// Streak computation over a habit's entries.

import { toISODate, addDays, diffDays, today as todayIso } from './date.js'

/**
 * Compute streak stats for a habit.
 *
 * @param {{target: number}} habit
 * @param {{date: string, count: number}[]} entries
 * @param {string} [now]
 * @returns {{currentStreak: number, longestStreak: number, completionRate: number}}
 */
export function computeStreak(habit, entries, now = todayIso()) {
  const target = Math.max(1, habit.target ?? 1)

  // Aggregate counts per date.
  const byDate = new Map()
  for (const e of entries) {
    if (typeof e.date !== 'string') continue
    byDate.set(e.date, (byDate.get(e.date) ?? 0) + (Number(e.count) || 0))
  }

  const done = (date) => (byDate.get(date) ?? 0) >= target

  // Longest streak — scan sorted dates once.
  const sortedDates = [...byDate.keys()].sort()
  let longestStreak = 0
  let run = 0
  let prev = null
  for (const date of sortedDates) {
    if (!done(date)) { run = 0; prev = date; continue }
    if (prev !== null && diffDays(prev, date) === 1 && done(prev)) run += 1
    else run = 1
    if (run > longestStreak) longestStreak = run
    prev = date
  }

  // Current streak — walk backwards from today. Allow "today not yet done" grace.
  let cursor = done(now) ? now : addDays(now, -1)
  let currentStreak = 0
  while (done(cursor)) {
    currentStreak += 1
    cursor = addDays(cursor, -1)
  }

  // Completion rate — over the last 30 days.
  const start = addDays(now, -29)
  let hits = 0
  for (let d = start; toISODate(d) !== addDays(now, 1); d = addDays(d, 1)) {
    if (done(d)) hits += 1
  }
  const completionRate = hits / 30

  return { currentStreak, longestStreak, completionRate }
}
