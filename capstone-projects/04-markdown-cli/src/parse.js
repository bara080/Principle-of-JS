// Line-based markdown tokenizer.
// Not CommonMark-compliant; covers the common cases with predictable rules.

export function parse(source) {
  const lines = String(source ?? '').split(/\r?\n/)
  const tokens = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Blank
    if (line.trim() === '') { i++; continue }

    // Horizontal rule
    if (/^(?:---+|\*\*\*+|___+)\s*$/.test(line)) {
      tokens.push({ type: 'hr' })
      i++
      continue
    }

    // ATX heading
    const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line)
    if (heading) {
      tokens.push({ type: 'heading', level: heading[1].length, text: heading[2] })
      i++
      continue
    }

    // Fenced code block
    const fence = /^```(\S*)\s*$/.exec(line)
    if (fence) {
      const lang = fence[1] || null
      const body = []
      i++
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        body.push(lines[i])
        i++
      }
      if (i < lines.length) i++
      tokens.push({ type: 'code', lang, text: body.join('\n') })
      continue
    }

    // Blockquote (one or more consecutive `> ` lines)
    if (/^>\s?/.test(line)) {
      const body = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        body.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      tokens.push({ type: 'blockquote', text: body.join('\n') })
      continue
    }

    // List (unordered or ordered)
    if (/^\s*(?:[-*+]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line)
      const items = []
      while (i < lines.length && /^\s*(?:[-*+]|\d+\.)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*(?:[-*+]|\d+\.)\s+/, ''))
        i++
      }
      tokens.push({ type: 'list', ordered, items })
      continue
    }

    // Paragraph — collect consecutive non-empty non-block lines.
    const buf = []
    while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i])) {
      buf.push(lines[i])
      i++
    }
    if (buf.length) tokens.push({ type: 'paragraph', text: buf.join(' ') })
  }

  return tokens
}

function isBlockStart(line) {
  return /^#{1,6}\s+/.test(line)
    || /^```/.test(line)
    || /^(?:---+|\*\*\*+|___+)\s*$/.test(line)
    || /^>\s?/.test(line)
    || /^\s*(?:[-*+]|\d+\.)\s+/.test(line)
}
