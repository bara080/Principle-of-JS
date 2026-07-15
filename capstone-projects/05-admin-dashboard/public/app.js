import { createStore } from '../src/store.js'
import { fetchOrders } from '../src/api.js'
import { applyFilter, aggregate } from '../src/filter.js'
import { createVirtualList } from '../src/virtual-list.js'

const store = createStore({
  loading: true,
  orders: [],
  filter: { q: '', status: null, sort: ['createdAt:desc'] },
})

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const list = createVirtualList(document.querySelector('#list'), {
  rowHeight: 36,
  renderRow: (o) => {
    const row = document.createElement('div')
    row.className = 'row'
    row.innerHTML = ''
    for (const text of [o.id, o.customer, o.status, fmt.format(o.totalCents / 100), o.createdAt]) {
      const span = document.createElement('span')
      span.textContent = text
      row.append(span)
    }
    return row
  },
})

function debounce(fn, ms) {
  let t
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms) }
}

function updateUI() {
  const { orders, filter } = store.getState()
  const filtered = applyFilter(orders, filter)
  const stats = aggregate(filtered)
  document.querySelector('#k-count').textContent = stats.count.toLocaleString()
  document.querySelector('#k-total').textContent = fmt.format(stats.totalCents / 100)
  document.querySelector('#k-paid').textContent = (stats.byStatus.paid ?? 0).toLocaleString()
  list.setData(filtered)
  writeUrl(filter)
}

function writeUrl(filter) {
  const params = new URLSearchParams()
  if (filter.q) params.set('q', filter.q)
  if (filter.status) params.set('status', filter.status)
  if (filter.sort?.length) params.set('sort', filter.sort.join(','))
  history.replaceState(null, '', params.toString() ? `?${params}` : location.pathname)
}

function readUrl() {
  const params = new URLSearchParams(location.search)
  return {
    q: params.get('q') ?? '',
    status: params.get('status') || null,
    sort: (params.get('sort') ?? 'createdAt:desc').split(',').filter(Boolean),
  }
}

store.subscribe(updateUI)

// wire filters
document.querySelector('#q').addEventListener('input', debounce((e) => {
  store.setState({ filter: { ...store.getState().filter, q: e.target.value } })
}, 150))
document.querySelector('#status').addEventListener('change', (e) => {
  store.setState({ filter: { ...store.getState().filter, status: e.target.value || null } })
})
document.querySelector('#sort').addEventListener('change', (e) => {
  store.setState({ filter: { ...store.getState().filter, sort: [e.target.value] } })
})

// restore from URL
const initial = readUrl()
document.querySelector('#q').value = initial.q
document.querySelector('#status').value = initial.status ?? ''
document.querySelector('#sort').value = initial.sort[0] ?? 'createdAt:desc'
store.setState({ filter: initial })

// initial load
const controller = new AbortController()
try {
  const orders = await fetchOrders({ signal: controller.signal })
  store.setState({ loading: false, orders })
} catch (err) {
  document.querySelector('#list').textContent = `Failed to load: ${err.message}`
}
