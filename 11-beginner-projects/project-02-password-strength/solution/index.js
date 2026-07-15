import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const TOP = new Set(JSON.parse(readFileSync(join(here, '..', 'assets', 'top-100.json'), 'utf8')))

export function assess(password, { userInfo = [] } = {}) {
  const feedback = []
  if (typeof password !== 'string' || !password) {
    return { score: 0, checks: { longEnough: false, hasVariety: false, notCommon: false, notPersonal: false }, feedback: ['password required'] }
  }

  const longEnough = password.length >= 12
  const hasVariety = /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[^a-zA-Z0-9]/.test(password)
  const notCommon = !TOP.has(password.toLowerCase())
  const lower = password.toLowerCase()
  const notPersonal = !userInfo.some((info) => info && lower.includes(info.toLowerCase()))

  if (!longEnough) feedback.push('use at least 12 characters')
  if (!hasVariety) feedback.push('mix upper, lower, digits, and symbols')
  if (!notCommon) feedback.push('this password is on breach lists')
  if (!notPersonal) feedback.push('avoid using your name or username')

  const score = [longEnough, hasVariety, notCommon, notPersonal].filter(Boolean).length
  return { score, checks: { longEnough, hasVariety, notCommon, notPersonal }, feedback }
}
