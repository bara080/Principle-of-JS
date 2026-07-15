import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

import { validateImport, isValidHabit, isValidEntry } from '../src/domain/validate.js'

describe('validateImport', () => {
  test('accepts a well-formed export', () => {
    const payload = {
      habits: [{ id: 'h1', name: 'Read', frequency: 'daily', target: 1, createdAt: '2026-06-01' }],
      entries: [{ id: 'e1', habitId: 'h1', date: '2026-07-01', count: 1 }],
    }
    const result = validateImport(payload)
    assert.equal(result.ok, true)
    assert.equal(result.data.habits.length, 1)
    assert.equal(result.data.entries.length, 1)
  })

  test('drops invalid entries silently', () => {
    const payload = {
      habits: [
        { id: 'h1', name: 'Read', frequency: 'daily', target: 1, createdAt: '2026-06-01' },
        { id: 'h2', frequency: 'daily', target: 1, createdAt: '2026-06-01' }, // no name
      ],
      entries: [],
    }
    const result = validateImport(payload)
    assert.equal(result.ok, true)
    assert.equal(result.data.habits.length, 1)
  })

  test('rejects empty payload', () => {
    assert.equal(validateImport({}).ok, false)
    assert.equal(validateImport(null).ok, false)
    assert.equal(validateImport({ habits: [{ bogus: true }] }).ok, false)
  })

  test('rejects prototype-pollution attempt', () => {
    const hostile = JSON.parse('{"__proto__": {"role":"admin"}, "habits": [], "entries": []}')
    const result = validateImport(hostile)
    assert.equal(result.ok, false)
    assert.equal({}.role, undefined)
  })
})

describe('isValidHabit / isValidEntry', () => {
  test('rejects non-integer target', () => {
    assert.equal(isValidHabit({ id: 'x', name: 'y', frequency: 'daily', target: 1.5, createdAt: 'z' }), false)
  })
  test('rejects bad date format', () => {
    assert.equal(isValidEntry({ id: 'x', habitId: 'y', date: '2026/07/14', count: 1 }), false)
  })
})
