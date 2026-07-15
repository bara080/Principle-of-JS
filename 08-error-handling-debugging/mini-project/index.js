// Module 08 — mini-project — Result + Error hierarchy (stub)

export class AppError extends Error {
  constructor(_msg, _opts) {
    super()
    throw new Error('TODO: AppError')
  }
}
export class NotFoundError extends AppError {}
export class ValidationError extends AppError {}
export class AuthError extends AppError {}

export const ok = (_data) => { throw new Error('TODO: ok') }
export const err = (_error) => { throw new Error('TODO: err') }
export const isOk = (_r) => { throw new Error('TODO: isOk') }

export async function wrap(_fn) {
  throw new Error('TODO: wrap')
}
