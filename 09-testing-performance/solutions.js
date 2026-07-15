// Module 09 — solutions

export const debounce = (fn, ms) => {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}

export const throttle = (fn, ms) => {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last >= ms) {
      last = now
      fn(...args)
    }
  }
}

export async function bench(name, fn, iterations = 1000) {
  // warm up JIT
  for (let i = 0; i < 10; i++) await fn()
  const t = performance.now()
  for (let i = 0; i < iterations; i++) await fn()
  const elapsed = performance.now() - t
  return { name, iterations, totalMs: elapsed, perOpMs: elapsed / iterations }
}
