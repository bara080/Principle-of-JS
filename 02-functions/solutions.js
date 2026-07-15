// Module 02 — solutions
// Reference implementations for exercises.js. Fill in as exercises are expanded.

export function memoize(fn) {
  const cache = new Map()
  return function memoized(...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const value = fn.apply(this, args)
    cache.set(key, value)
    return value
  }
}

export function debounce(fn, ms) {
  let timer
  return function debounced(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), ms)
  }
}

export function throttle(fn, ms) {
  let last = 0
  let queued = null
  return function throttled(...args) {
    const now = Date.now()
    if (now - last >= ms) {
      last = now
      fn.apply(this, args)
    } else {
      clearTimeout(queued)
      queued = setTimeout(
        () => {
          last = Date.now()
          fn.apply(this, args)
        },
        ms - (now - last),
      )
    }
  }
}

export const once = (fn) => {
  let called = false
  let result
  return function onced(...args) {
    if (called) return result
    called = true
    result = fn.apply(this, args)
    return result
  }
}

export const pipe = (...fns) => (initial) => fns.reduce((acc, fn) => fn(acc), initial)
export const compose = (...fns) => (initial) => fns.reduceRight((acc, fn) => fn(acc), initial)
