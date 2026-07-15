// Date math — pure, UTC-based to avoid DST landmines.
// All dates are YYYY-MM-DD strings; conversions happen at the edge.

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function toISODate(date) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toISOString().slice(0, 10)
}
// Returns the current date as an ISO date string.
export function today(now = new Date()) {
  return toISODate(now)
}

export function addDays(iso, n) {
  const t = Date.parse(`${iso}T00:00:00Z`)
  return toISODate(new Date(t + n * MS_PER_DAY))
}

export function diffDays(a, b) {
  const ta = Date.parse(`${a}T00:00:00Z`)
  const tb = Date.parse(`${b}T00:00:00Z`)
  return Math.round((tb - ta) / MS_PER_DAY)
}

export function isBefore(a, b) { return diffDays(a, b) > 0 }
export function isAfter(a, b) { return diffDays(a, b) < 0 }

export function daysBetween(start, end) {
  const days = []
  for (let d = start; !isAfter(d, end); d = addDays(d, 1)) days.push(d)
  return days
}
