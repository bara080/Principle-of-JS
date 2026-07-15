// Public entry — pipeline of parse → plugins → render.

import { parse } from './parse.js'
import { render } from './render.js'

export async function md(source, { plugins = [] } = {}) {
  let tokens = parse(source)
  for (const plugin of plugins) {
    const result = await plugin({ tokens })
    if (Array.isArray(result)) tokens = result
  }
  return render(tokens)
}

export { parse, render }
