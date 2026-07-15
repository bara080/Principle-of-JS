// Token → HTML rendering. Escapes user text.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c])

function renderInline(text) {
  let out = escape(text)
  // Code (backticks) — do first so we don't touch content inside.
  out = out.replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`)
  // Bold
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/__([^_]+)__/g, '<strong>$1</strong>')
  // Italic
  out = out.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
  out = out.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>')
  // Images ![alt](src)
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, alt, src, title) => `<img src="${src}" alt="${alt}"${title ? ` title="${title}"` : ''}>`)
  // Links [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, txt, url, title) => `<a href="${url}"${title ? ` title="${title}"` : ''}>${txt}</a>`)
  return out
}

export function render(tokens) {
  const out = []
  for (const t of tokens) {
    switch (t.type) {
      case 'hr':
        out.push('<hr>')
        break
      case 'heading':
        out.push(`<h${t.level}>${renderInline(t.text)}</h${t.level}>`)
        break
      case 'paragraph':
        out.push(`<p>${renderInline(t.text)}</p>`)
        break
      case 'code':
        out.push(`<pre><code${t.lang ? ` class="language-${escape(t.lang)}"` : ''}>${escape(t.text)}</code></pre>`)
        break
      case 'blockquote':
        out.push(`<blockquote>${renderInline(t.text)}</blockquote>`)
        break
      case 'list':
        out.push(t.ordered ? '<ol>' : '<ul>')
        for (const item of t.items) out.push(`<li>${renderInline(item)}</li>`)
        out.push(t.ordered ? '</ol>' : '</ul>')
        break
      default:
        // ignore unknown token types — plugins may drop them here
        break
    }
  }
  return out.join('\n')
}
