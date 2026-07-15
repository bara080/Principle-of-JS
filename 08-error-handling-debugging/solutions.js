// Module 08 — solutions

export class AppError extends Error {
  constructor(message, { code, cause, status } = {}) {
    super(message, { cause })
    this.name = this.constructor.name
    this.code = code
    this.status = status
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      cause: this.cause instanceof Error ? { name: this.cause.name, message: this.cause.message } : this.cause,
    }
  }
}

export class NotFoundError extends AppError {
  constructor(message, opts) { super(message, { status: 404, code: 'not_found', ...opts }) }
}
export class ValidationError extends AppError {
  constructor(message, opts) { super(message, { status: 400, code: 'validation', ...opts }) }
}
export class AuthError extends AppError {
  constructor(message, opts) { super(message, { status: 401, code: 'auth', ...opts }) }
}

export const ok  = (data) => ({ ok: true, data })
export const err = (message, extra = {}) => ({ ok: false, error: { message, ...extra } })

export async function safeAwait(promise) {
  try { return ok(await promise) }
  catch (e) { return err(e.message, { cause: e }) }
}
