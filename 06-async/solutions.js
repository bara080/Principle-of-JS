// Module 06 — solutions

export function sleep(ms, { signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Error('aborted'))
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new Error('aborted'))
    })
  })
}

export async function retry(fn, { attempts = 3, base = 200, factor = 2, jitter = 0.5 } = {}) {
  if (attempts < 1) throw new TypeError('attempts must be ≥ 1')

  let lastErr
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn(i)
    } catch (err) {
      lastErr = err
      if (i === attempts - 1) break
      const delay = base * factor ** i * (1 - jitter + Math.random() * jitter * 2)
      await sleep(delay)
    }
  }
  throw lastErr
}

export async function withTimeout(promise, ms) {
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), ms)
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        ac.signal.addEventListener('abort', () => reject(new Error(`timeout after ${ms}ms`)))
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}
