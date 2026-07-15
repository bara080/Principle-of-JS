// Pure filter/sort/aggregate over an order list.
// No DOM, no fetch — trivially testable in Node.

/**
 * @typedef {{ status: string, customer: string, totalCents: number, createdAt: string }} Order
 */

const STATUSES = new Set(['pending', 'paid', 'refunded', 'cancelled'])

export function normalizeFilter(input = {}) {
  return {
    q: typeof input.q === 'string' ? input.q.trim().toLowerCase() : '',
    status: STATUSES.has(input.status) ? input.status : null,
    minCents: Number.isFinite(input.minCents) ? input.minCents : null,
    maxCents: Number.isFinite(input.maxCents) ? input.maxCents : null,
    since: typeof input.since === 'string' ? input.since : null,
    until: typeof input.until === 'string' ? input.until : null,
    sort: Array.isArray(input.sort) ? input.sort : [],
  }
}

export function applyFilter(orders, rawFilter) {
  const f = normalizeFilter(rawFilter)
  let out = orders

  if (f.q) {
    out = out.filter((o) => o.customer.toLowerCase().includes(f.q))
  }
  if (f.status) out = out.filter((o) => o.status === f.status)
  if (f.minCents !== null) out = out.filter((o) => o.totalCents >= f.minCents)
  if (f.maxCents !== null) out = out.filter((o) => o.totalCents <= f.maxCents)
  if (f.since) out = out.filter((o) => o.createdAt >= f.since)
  if (f.until) out = out.filter((o) => o.createdAt <= f.until)

  if (f.sort.length) {
    const comparator = buildComparator(f.sort)
    // Preserve stability by copying; V8 sort is stable, but callers might not know.
    out = [...out].sort(comparator)
  }

  return out
}

function buildComparator(sortSpec) {
  const parsed = sortSpec.map((s) => {
    if (typeof s !== 'string') return null
    const [key, dir = 'asc'] = s.split(':')
    return { key, sign: dir === 'desc' ? -1 : 1 }
  }).filter(Boolean)

  return (a, b) => {
    for (const { key, sign } of parsed) {
      const va = a[key]
      const vb = b[key]
      if (va === vb) continue
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * sign
      return (va > vb ? 1 : -1) * sign
    }
    return 0
  }
}

export function aggregate(orders) {
  let totalCents = 0
  let count = 0
  const byStatus = {}
  for (const o of orders) {
    totalCents += o.totalCents
    count += 1
    byStatus[o.status] = (byStatus[o.status] ?? 0) + 1
  }
  return { totalCents, count, byStatus }
}
