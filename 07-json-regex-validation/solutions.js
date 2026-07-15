// Module 07 — solutions

export function safeParse(text) {
  try { return { ok: true, data: JSON.parse(text) } }
  catch (err) { return { ok: false, error: err.message } }
}

export function isValidSlug(value) {
  return typeof value === 'string' && /^[a-z0-9-]+$/.test(value)
}

export function isValidUuid(value) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

export function isStrongPassword(value) {
  if (typeof value !== 'string' || value.length < 8) return false
  const hasLower = /[a-z]/.test(value)
  const hasUpper = /[A-Z]/.test(value)
  const hasDigit = /\d/.test(value)
  const hasSymbol = /[^a-zA-Z0-9]/.test(value)
  return hasLower && hasUpper && hasDigit && hasSymbol
}
