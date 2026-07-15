// Common array problems — implement, then test at the bottom.
import assert from 'node:assert/strict'

export function dedupe(_arr) { throw new Error('TODO') }
export function chunk(_arr, _n) { throw new Error('TODO') }
export function rotate(_arr, _k) { throw new Error('TODO') }
export function twoSum(_arr, _target) { throw new Error('TODO') }
export function mergeSorted(_a, _b) { throw new Error('TODO') }
export function flattenDeep(_arr) { throw new Error('TODO') }
export function groupBy(_arr, _keyFn) { throw new Error('TODO') }

// self-check
function check(name, fn) {
  try { fn(); console.log('  ok   ', name) }
  catch (e) { console.log('  FAIL ', name, '—', e.message) }
}

check('dedupe',   () => assert.deepEqual(dedupe([1, 2, 1, 3, 2]), [1, 2, 3]))
check('chunk',    () => assert.deepEqual(chunk([1,2,3,4,5], 2), [[1,2],[3,4],[5]]))
check('rotate',   () => assert.deepEqual(rotate([1,2,3,4,5], 2), [4,5,1,2,3]))
check('twoSum',   () => assert.deepEqual(twoSum([2,7,11,15], 9), [0, 1]))
check('merge',    () => assert.deepEqual(mergeSorted([1,3,5],[2,4,6]), [1,2,3,4,5,6]))
check('flatten',  () => assert.deepEqual(flattenDeep([1,[2,[3,[4]]]]), [1,2,3,4]))
check('groupBy',  () => assert.deepEqual(
  groupBy([{k:'a'},{k:'b'},{k:'a'}], (o) => o.k),
  { a: [{k:'a'},{k:'a'}], b: [{k:'b'}] },
))
