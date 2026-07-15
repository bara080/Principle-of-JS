// Windowed virtualization — renders only visible rows.
//
// Usage:
//   const list = createVirtualList(container, {
//     rowHeight: 40,
//     renderRow: (item, i) => domNode,
//   })
//   list.setData(orders)

export function createVirtualList(container, { rowHeight, renderRow, overscan = 8 }) {
  let data = []
  const viewport = document.createElement('div')
  const spacer = document.createElement('div')
  const window_ = document.createElement('div')
  window_.style.position = 'absolute'
  window_.style.top = '0'
  window_.style.left = '0'
  window_.style.right = '0'
  viewport.style.position = 'relative'
  viewport.style.overflowY = 'auto'
  viewport.style.height = '100%'
  viewport.append(spacer, window_)
  container.textContent = ''
  container.append(viewport)

  const render = () => {
    const scrollTop = viewport.scrollTop
    const visibleCount = Math.ceil(viewport.clientHeight / rowHeight)
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
    const end = Math.min(data.length, start + visibleCount + overscan * 2)

    window_.style.transform = `translateY(${start * rowHeight}px)`
    window_.textContent = ''
    for (let i = start; i < end; i++) {
      const node = renderRow(data[i], i)
      node.style.height = `${rowHeight}px`
      window_.append(node)
    }
  }

  viewport.addEventListener('scroll', render, { passive: true })
  new ResizeObserver(render).observe(viewport)

  return {
    setData(next) {
      data = next
      spacer.style.height = `${data.length * rowHeight}px`
      render()
    },
    refresh: render,
  }
}
