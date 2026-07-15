# 04 — Markdown CLI

A minimal but real markdown-to-HTML CLI with a plugin system. Zero dependencies.

## What it does

- Reads a `.md` file or stdin.
- Outputs HTML to stdout or a file.
- Supports headings, paragraphs, emphasis, code (inline + fenced), lists,
  blockquotes, links, images, horizontal rules.
- Plugin API: transform tokens after parsing, before rendering.
- Watch mode: re-render on file change.
- Deliberately does *not* try to be CommonMark-perfect — it's a scoped
  implementation covering ~95% of what people actually write.

## Modules exercised

- **01 (fundamentals)** — string coercion, control flow, guard clauses.
- **02 (functions)** — plugin pipeline is function composition.
- **04 (arrays/strings)** — line-based parsing, token trees.
- **07 (JSON/regex)** — pattern matching for markdown constructs.
- **08 (errors)** — friendly CLI errors, non-zero exit codes.
- **09 (testing)** — unit + snapshot-ish tests.
- **10 (tooling)** — packaged with a proper `bin` entry.

## Install and use

```bash
cd 04-markdown-cli
npm link                          # makes `mdc` global from this dir
mdc README.md > out.html
mdc README.md -o out.html
mdc --watch README.md -o out.html
cat README.md | mdc                # from stdin
```

## Options

```text
mdc <file>                        input file (or stdin)
    -o, --output <file>           write to file
    --watch                       re-render on change
    --plugin <path>               load a plugin (repeatable)
    -v, --version
    -h, --help
```

## Plugin API

```js
// my-plugin.js
export default function myPlugin({ tokens }) {
  return tokens.map((t) => (
    t.type === 'heading' ? { ...t, text: `📚 ${t.text}` } : t
  ))
}
```

Then: `mdc --plugin ./my-plugin.js README.md`.

## Tests

```bash
node --test tests/
```

## Extensions

- Frontmatter parsing.
- Table support.
- Syntax highlighting for code blocks (dep or plugin).
- HTML output → static site generator.
- Publish to npm as a real global CLI.

## What "done" looks like

- [ ] Handles the golden-path fixtures.
- [ ] `--watch` re-renders reliably.
- [ ] Plugin transforms compose in order.
- [ ] Exits non-zero with a helpful message on bad input.
- [ ] Includes a small tutorial in `docs/`.
