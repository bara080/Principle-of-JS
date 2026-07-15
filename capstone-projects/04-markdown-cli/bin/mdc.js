#!/usr/bin/env node
// mdc — markdown compiler CLI

import { readFile, writeFile, watch } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { md } from '../src/index.js'

function parseArgs(argv) {
  const args = { input: null, output: null, watch: false, plugins: [] }
  const rest = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '-h' || arg === '--help') return { help: true }
    if (arg === '-v' || arg === '--version') return { version: true }
    if (arg === '-o' || arg === '--output') { args.output = argv[++i]; continue }
    if (arg === '--watch') { args.watch = true; continue }
    if (arg === '--plugin') { args.plugins.push(argv[++i]); continue }
    rest.push(arg)
  }
  args.input = rest[0] ?? null
  return args
}

function usage() {
  return `mdc — markdown compiler

Usage:
  mdc <file> [-o out.html] [--watch] [--plugin ./p.js]...
  cat in.md | mdc > out.html
`
}

async function readInput(input) {
  if (input) return readFile(input, 'utf8')
  // stdin
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

async function loadPlugin(spec) {
  const url = pathToFileURL(resolve(spec)).href
  const mod = await import(url)
  const fn = mod.default ?? mod.plugin
  if (typeof fn !== 'function') throw new Error(`plugin ${spec} has no default export`)
  return fn
}

async function build(args) {
  const source = await readInput(args.input)
  const plugins = await Promise.all(args.plugins.map(loadPlugin))
  const html = await md(source, { plugins })
  if (args.output) {
    await writeFile(args.output, html + '\n', 'utf8')
    process.stderr.write(`wrote ${args.output}\n`)
  } else {
    process.stdout.write(html + '\n')
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) { process.stdout.write(usage()); return }
  if (args.version) { process.stdout.write('0.1.0\n'); return }

  try {
    await build(args)
  } catch (err) {
    process.stderr.write(`mdc: ${err.message}\n`)
    process.exit(1)
  }

  if (args.watch && args.input) {
    process.stderr.write(`watching ${args.input}\n`)
    for await (const _event of watch(args.input)) {
      try { await build(args) }
      catch (err) { process.stderr.write(`mdc: ${err.message}\n`) }
    }
  }
}

main()
