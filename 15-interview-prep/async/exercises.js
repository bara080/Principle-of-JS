// Predict every log line, then verify.

// Q1 — sync + micro + macro
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('4')
// → 1, 4, 3, 2

// Q2 — Promise.all short-circuits
Promise.all([
  Promise.resolve('a'),
  Promise.reject('b'),
  Promise.resolve('c'),
]).catch((e) => console.log('caught', e))
// → 'caught b'

// Q3 — async function return value
async function fn() { return 42 }
fn().then((v) => console.log('async returned', v))
// → 'async returned 42'

// Q4 — Promise.race with timeout
const timeout = (ms) => new Promise((_, r) => setTimeout(() => r('timeout'), ms))
Promise.race([new Promise((r) => setTimeout(() => r('work'), 100)), timeout(50)])
  .then((v) => console.log('race:', v))
  .catch((e) => console.log('race err:', e))
// → 'race err: timeout' (since 50ms < 100ms)
