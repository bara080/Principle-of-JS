// Two Sum — return indices of the two numbers that sum to target.
// Constraint: exactly one solution; may not use the same element twice.

import assert from 'node:assert/strict'

export function twoSum(nums, target) {
  const seen = new Map()
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (seen.has(need)) return [seen.get(need), i]
    seen.set(nums[i], i)
  }
  return null
}

// self-check
assert.deepEqual(twoSum([2, 7, 11, 15], 9), [0, 1])
assert.deepEqual(twoSum([3, 2, 4], 6), [1, 2])
assert.deepEqual(twoSum([3, 3], 6), [0, 1])
console.log('two-sum ok — O(n) time, O(n) space')
