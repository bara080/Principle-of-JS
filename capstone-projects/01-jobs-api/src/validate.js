// Per-route request validators. Return {ok, data|errors} — never throw.

import { ValidationError } from './errors.js'

const ROLES = new Set(['applicant', 'employer', 'admin'])
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

function fieldErr(field, message) { return { field, message } }

export function validateRegistration(body) {
  const errors = []
  if (typeof body?.email !== 'string' || !EMAIL_RE.test(body.email)) {
    errors.push(fieldErr('email', 'valid email required'))
  }
  if (typeof body?.password !== 'string' || body.password.length < 12) {
    errors.push(fieldErr('password', 'at least 12 characters'))
  }
  if (!ROLES.has(body?.role)) {
    errors.push(fieldErr('role', `one of ${[...ROLES].join(', ')}`))
  }
  if (errors.length) return { ok: false, errors }
  return {
    ok: true,
    data: {
      email: body.email.trim().toLowerCase(),
      password: body.password,
      role: body.role,
    },
  }
}

export function validateLogin(body) {
  const errors = []
  if (typeof body?.email !== 'string' || !EMAIL_RE.test(body.email)) {
    errors.push(fieldErr('email', 'valid email required'))
  }
  if (typeof body?.password !== 'string' || !body.password) {
    errors.push(fieldErr('password', 'required'))
  }
  if (errors.length) return { ok: false, errors }
  return { ok: true, data: { email: body.email.trim().toLowerCase(), password: body.password } }
}

export function validateJobCreate(body) {
  const errors = []
  if (typeof body?.title !== 'string' || !body.title.trim()) {
    errors.push(fieldErr('title', 'required'))
  } else if (body.title.length > 120) {
    errors.push(fieldErr('title', 'max 120 chars'))
  }
  if (typeof body?.description !== 'string' || !body.description.trim()) {
    errors.push(fieldErr('description', 'required'))
  }
  if (typeof body?.location !== 'string' || !body.location.trim()) {
    errors.push(fieldErr('location', 'required'))
  }
  const remote = body?.remote
  if (remote !== undefined && typeof remote !== 'boolean') {
    errors.push(fieldErr('remote', 'must be boolean'))
  }
  if (errors.length) return { ok: false, errors }
  return {
    ok: true,
    data: {
      title: body.title.trim(),
      description: body.description.trim(),
      location: body.location.trim(),
      remote: Boolean(body.remote),
    },
  }
}

export function orThrow(result) {
  if (!result.ok) throw new ValidationError('invalid input', { fields: result.errors })
  return result.data
}
