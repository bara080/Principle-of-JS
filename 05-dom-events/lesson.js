// Module 05 — DOM & Events
// Open index.html in a browser. This file does nothing under `node`.
//
// Objective: Make pages interactive.
//
// Checklist:
//   [ ] The DOM vs the source HTML
//   [ ] Selecting — getElementById, querySelector, querySelectorAll
//   [ ] Creating, inserting, removing nodes
//   [ ] textContent vs innerHTML (and why innerHTML is a security risk)
//   [ ] addEventListener, and removing listeners
//   [ ] Propagation — capture and bubble phases
//   [ ] Event delegation — one listener for many children
//   [ ] preventDefault() and stopPropagation()
//   [ ] localStorage and sessionStorage

// 1. Click counter — state lives in a closure, not on the element.
const button = document.querySelector('#counter')
let clicks = 0

button.addEventListener('click', () => {
  clicks++
  button.textContent = `Clicked ${clicks} time${clicks === 1 ? '' : 's'}`
})

// 2. Event delegation. The listener is on the <ul>, so it also handles
//    <li>s that don't exist yet. event.target is what was actually clicked.
const list = document.querySelector('#todos')

list.addEventListener('click', event => {
  const trigger = event.target.closest('[data-action="delete"]')
  if (!trigger) return          // clicked the text, not a button — ignore

  trigger.closest('li').remove()
})

// Exercise: add an input + "Add" button that appends a new <li>.
// The delete button on it must work with NO new listener. That is the payoff.
