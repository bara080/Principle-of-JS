// Predict the output. Then run: node 15-interview-prep/language/exercises.js

console.log(0.1 + 0.2)                        // 0.30000000000000004
console.log(0 == '')                          // true
console.log(0 === '')                         // false
console.log(null == undefined)                // true
console.log(NaN === NaN)                      // false
console.log(typeof null)                      // 'object'
console.log(typeof [])                        // 'object'
console.log([] + [])                          // ''
console.log([] + {})                          // '[object Object]'
console.log({ } + [])                         // depends on parser context
console.log('5' + 1)                          // '51'
console.log('5' - 1)                          // 4
console.log(Number(''))                       // 0
console.log(Number(' '))                      // 0
console.log(Number(null))                     // 0
console.log(Number(undefined))                // NaN
console.log(!!'false')                        // true
console.log(!!0)                              // false
console.log(1 < 2 < 3)                        // true — (1 < 2) === true → 1 < 3
console.log(3 > 2 > 1)                        // false — (3 > 2) → 1; 1 > 1 → false
