import { test } from 'node:test'
import assert from 'node:assert/strict'

import { isPalindrome } from '../src/index.js'

test('handles the classic examples', { skip: 'implement first' }, () => {
  assert.equal(isPalindrome('A man, a plan, a canal: Panama'), true)
  assert.equal(isPalindrome('race a car'), false)
  assert.equal(isPalindrome(''), true)
})
