// Password hashing (scrypt) + HMAC-signed opaque tokens.
// Not a JWT — deliberately simpler and library-free.

import { scryptSync, randomBytes, createHmac, timingSafeEqual } from 'node:crypto'
import { AuthError } from './errors.js'

const KEYLEN = 64
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, KEYLEN).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [salt, hashHex] = stored.split(':')
  if (!salt || !hashHex) return false
  const expected = Buffer.from(hashHex, 'hex')
  const actual = scryptSync(password, salt, KEYLEN)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export function createTokenIssuer(secret) {
  if (!secret || secret.length < 16) {
    throw new Error('TOKEN_SECRET must be at least 16 chars')
  }

  function sign(payload) {
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const sig = createHmac('sha256', secret).update(body).digest('base64url')
    return `${body}.${sig}`
  }

  function issue(user) {
    const exp = Date.now() + TOKEN_TTL_MS
    return sign({ sub: user.id, role: user.role, exp })
  }

  function verify(token) {
    if (typeof token !== 'string' || !token.includes('.')) throw new AuthError()
    const [body, sig] = token.split('.')
    const expected = createHmac('sha256', secret).update(body).digest('base64url')
    if (sig !== expected) throw new AuthError('bad signature')
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) {
      throw new AuthError('token expired')
    }
    return payload
  }

  return { issue, verify }
}
