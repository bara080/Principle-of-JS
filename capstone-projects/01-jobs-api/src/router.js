// Tiny router — pattern like /jobs/:id, method dispatch.

export function createRouter() {
  const routes = []

  function add(method, pattern, handler) {
    const paramNames = []
    const regex = new RegExp(
      '^'
      + pattern
        .split('/')
        .map((seg) => {
          if (!seg.startsWith(':')) return seg
          paramNames.push(seg.slice(1))
          return '([^/]+)'
        })
        .join('/')
      + '$',
    )
    routes.push({ method, regex, paramNames, handler })
  }

  function find(method, path) {
    for (const route of routes) {
      if (route.method !== method) continue
      const match = route.regex.exec(path)
      if (!match) continue
      const params = {}
      route.paramNames.forEach((name, i) => { params[name] = match[i + 1] })
      return { handler: route.handler, params }
    }
    return null
  }

  return {
    get:    (p, h) => add('GET', p, h),
    post:   (p, h) => add('POST', p, h),
    patch:  (p, h) => add('PATCH', p, h),
    delete: (p, h) => add('DELETE', p, h),
    find,
  }
}
