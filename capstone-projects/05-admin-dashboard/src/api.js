// Mocked API. Returns a Promise so consumers behave like real fetch.

const STATUSES = ['pending', 'paid', 'refunded', 'cancelled']

export function generateOrders(n = 10_000, seed = 1) {
  // Deterministic-ish pseudorandom for demo purposes.
  let state = seed
  const rand = () => (state = (state * 1103515245 + 12345) & 0x7fffffff, state / 0x7fffffff)

  const first = ['Ada', 'Grace', 'Linus', 'Alan', 'Guido', 'Margaret', 'Bjarne', 'Ken', 'Rob', 'Barbara']
  const last  = ['Lovelace', 'Hopper', 'Torvalds', 'Turing', 'van Rossum', 'Hamilton', 'Stroustrup', 'Thompson', 'Pike', 'Liskov']

  const orders = []
  for (let i = 0; i < n; i++) {
    const day = 1 + Math.floor(rand() * 27)
    const month = 1 + Math.floor(rand() * 12)
    const iso = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    orders.push({
      id: `ord_${i.toString(36).padStart(5, '0')}`,
      customer: `${first[Math.floor(rand() * first.length)]} ${last[Math.floor(rand() * last.length)]}`,
      status: STATUSES[Math.floor(rand() * STATUSES.length)],
      totalCents: Math.floor(500 + rand() * 500_000),
      createdAt: iso,
    })
  }
  return orders
}

const cache = new Map()

export async function fetchOrders({ signal, delayMs = 300 } = {}) {
  await new Promise((resolve, reject) => {
    const t = setTimeout(resolve, delayMs)
    signal?.addEventListener('abort', () => {
      clearTimeout(t)
      reject(new DOMException('aborted', 'AbortError'))
    })
  })
  if (!cache.has('orders')) cache.set('orders', generateOrders(10_000))
  return cache.get('orders')
}
