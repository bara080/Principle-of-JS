// Project 01 — DOM wiring (browser-only)
import { createCounter } from './counter.js'

if (typeof document !== 'undefined') {
  const counter = createCounter({
    initial: Number(localStorage.getItem('counter.value') ?? 0),
  })
  const display = document.querySelector('#value')
  const set = (v) => {
    display.textContent = String(v)
    localStorage.setItem('counter.value', String(v))
  }
  counter.subscribe(set)
  set(counter.read())

  document.querySelector('#inc').addEventListener('click', counter.increment)
  document.querySelector('#dec').addEventListener('click', counter.decrement)
  document.querySelector('#reset').addEventListener('click', counter.reset)
}
