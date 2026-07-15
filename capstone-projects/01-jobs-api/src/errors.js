// Typed error hierarchy. Every subclass maps to an HTTP status.

export class AppError extends Error {
  constructor(message, { code, status = 500, fields, cause } = {}) {
    super(message, { cause })
    this.name = this.constructor.name
    this.code = code ?? 'internal'
    this.status = status
    this.fields = fields
  }
  toJSON() {
    return { code: this.code, message: this.message, fields: this.fields }
  }
}

export class ValidationError extends AppError {
  constructor(message, opts) { super(message, { status: 400, code: 'validation', ...opts }) }
}
export class AuthError extends AppError {
  constructor(message = 'unauthorized', opts) { super(message, { status: 401, code: 'unauthorized', ...opts }) }
}
export class ForbiddenError extends AppError {
  constructor(message = 'forbidden', opts) { super(message, { status: 403, code: 'forbidden', ...opts }) }
}
export class NotFoundError extends AppError {
  constructor(message = 'not found', opts) { super(message, { status: 404, code: 'not_found', ...opts }) }
}
export class ConflictError extends AppError {
  constructor(message, opts) { super(message, { status: 409, code: 'conflict', ...opts }) }
}
