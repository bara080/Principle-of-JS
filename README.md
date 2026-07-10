# Learning JavaScript

A structured learning roadmap and study notes for JavaScript, distilled from
the [GeeksforGeeks JavaScript Tutorial](https://www.geeksforgeeks.org/javascript/javascript/)
and organized for self-paced study.

> **Goal:** Take a learner from "what is a variable?" to confidently shipping
> modern JavaScript — frontend, backend, async, and the deeper patterns —
> with checkpoints, exercises, and a portfolio of projects along the way.

---

## Table of Contents

1. [What is JavaScript?](#1-what-is-javascript)
2. [Why Learn JavaScript?](#2-why-learn-javascript)
3. [Prerequisites](#3-prerequisites)
4. [Setup](#4-setup)
5. [How to Use This Repo](#5-how-to-use-this-repo)
6. [Module 1 — Fundamentals](#module-1--fundamentals)
7. [Module 2 — Functions Deep Dive](#module-2--functions-deep-dive)
8. [Module 3 — Objects & OOP](#module-3--objects--oop)
9. [Module 4 — Arrays, Strings & Data Structures](#module-4--arrays-strings--data-structures)
10. [Module 5 — DOM & Events](#module-5--dom--events)
11. [Module 6 — Asynchronous JavaScript](#module-6--asynchronous-javascript)
12. [Module 7 — JSON, Regex & Validation](#module-7--json-regex--validation)
13. [Module 8 — Error Handling & Debugging](#module-8--error-handling--debugging)
14. [Module 9 — Testing & Performance](#module-9--testing--performance)
15. [Module 10 — Modern JS & Tooling](#module-10--modern-js--tooling)
16. [Module 11 — Beginner Projects](#module-11--beginner-projects)
17. [Module 12 — Intermediate Projects](#module-12--intermediate-projects)
18. [Module 13 — Advanced Projects](#module-13--advanced-projects)
19. [Module 14 — Ecosystem Tour](#module-14--ecosystem-tour)
20. [Module 15 — Interview Prep](#module-15--interview-prep)
21. [Reference Cheatsheet](#reference-cheatsheet)
22. [Source](#source)

---

## 1. What is JavaScript?

JavaScript is a **lightweight, interpreted, single-threaded** programming
language that runs in browsers and on servers (Node.js, Deno, Bun). It's the
language of the web — every modern site uses it for interactivity, and most
backend stacks now support it natively.

**Key features**

- Runs in **every browser** and on the server via Node.js
- Dynamically typed, prototype-based, with first-class functions
- Event-driven and asynchronous via the event loop
- Powerful ecosystem: React, Vue, Angular, Express, Next.js

## 2. Why Learn JavaScript?

- Required for **all** web frontend work
- Backend via **Node.js** — same language, full stack
- Huge job market: Frontend, Backend, Full-Stack, Mobile (React Native)
- Used by Google, Meta, Netflix, Amazon, and effectively every web product
- Mobile (React Native), desktop (Electron), IoT (Johnny-Five), even ML
  (TensorFlow.js)

## 3. Prerequisites

- Basic **HTML** and **CSS** — enough to structure and style a page
- A code editor (VS Code recommended)
- Comfort with a terminal for running Node scripts

## 4. Setup

You can start in two minutes — JavaScript ships with every browser.

```bash
# Option A: Browser DevTools
#   Open any site → Cmd/Ctrl+Option+I → Console tab → start typing

# Option B: Node.js (server-side / scripts)
brew install node          # macOS Homebrew
node --version
npm --version

# Run a script
node hello.js

# Modern package manager (optional, faster than npm)
brew install pnpm
```

**Recommended tooling**

- **Editor:** VS Code + ESLint + Prettier extensions
- **Linter:** ESLint
- **Formatter:** Prettier
- **Type checker:** TypeScript (or JSDoc + `tsc --checkJs`)
- **Test runner:** Vitest or Jest
- **Bundler:** Vite (frontend), tsup (libraries)

## 5. How to Use This Repo

1. One module per study session.
2. Type every example yourself — don't copy/paste.
3. Finish the **exercises** before moving on.
4. Check off items as you complete them.
5. Lock in skills by building the projects in Modules 11–13.

**Layout**

| Path | What it is |
|---|---|
| `NN-topic/lesson.js` | Notes and runnable examples. Run with `node`. |
| `NN-topic/exercises.js` | Do the work here. |
| [`practice/exercises.js`](practice/exercises.js) | Six async exercises, **auto-graded**. |
| [`task.md`](task.md) | Test yourself: predict output, find bugs, explain. |
| [`notes-from-screenshots.md`](notes-from-screenshots.md) | Knowledge extracted from saved screenshots. |

**Grade yourself**

```bash
npm test              # run the practice suite
npm run test:watch    # re-run on save
```

The tests fail until you implement `practice/exercises.js`. They check the edge
cases that are easy to miss — settle order, empty inputs, whether your code is
actually concurrent. Answers are in [task.md](task.md), but watch a test fail
first.

---

## Module 1 — Fundamentals

**Objective:** Read and write basic JavaScript with confidence.

- [ ] Where JS runs — browser, Node.js, embedded engines
- [ ] Including JS in HTML — inline, `<script>`, `<script type="module">`
- [ ] Using the **browser console**
- [ ] Variables — `var` vs `let` vs `const`
- [ ] **Data types** — string, number, boolean, null, undefined, BigInt,
      Symbol, object
- [ ] **Type conversion** — implicit coercion, `Number()`, `String()`,
      `Boolean()`, `===` vs `==`
- [ ] **Operators** — arithmetic, comparison, logical, bitwise, assignment,
      ternary, nullish coalescing `??`, optional chaining `?.`
- [ ] **Control flow** — `if`/`else`, `switch`, ternary
- [ ] **Loops** — `for`, `while`, `do...while`, `for...in`, `for...of`,
      `break`/`continue`
- [ ] **Scope** — global, function, block, lexical

**Exercise:** FizzBuzz from 1 to 100, then refactor with `Array.from` and
`map`.

## Module 2 — Functions Deep Dive

**Objective:** Master the language's most-used building block.

- [ ] Function declarations, expressions, arrow functions
- [ ] Default, rest (`...args`), and spread parameters
- [ ] **Hoisting** — declarations vs expressions vs arrow
- [ ] **`this`** — and how arrow functions change the rules
- [ ] **Function binding** — `call`, `apply`, `bind`
- [ ] **Closures** — and practical uses (counters, memoization, modules)
- [ ] **Higher-order functions** — functions in/out as values
- [ ] **Callbacks** vs Promises vs async/await
- [ ] **IIFEs** — `(function(){ ... })()`
- [ ] **Iterators** and the iterator protocol
- [ ] **Generators** — `function*` and `yield`

**Exercise:** Write a `memoize(fn)` higher-order function and use it to
cache an expensive computation.

## Module 3 — Objects & OOP

**Objective:** Model data with objects and classes.

- [ ] Object literals, property shorthand, computed keys
- [ ] Methods and `this` inside methods
- [ ] **Prototypes** and prototype chain
- [ ] **ES6 classes** — `class`, `constructor`, methods
- [ ] **Inheritance** — `extends`, `super()`
- [ ] **Getters and setters** — `get`/`set`
- [ ] **Static methods** and properties
- [ ] **Encapsulation** — `#privateField`, closures, naming conventions
- [ ] **Abstraction**, **polymorphism** in JS
- [ ] Object destructuring and spread

**Exercise:** Model a `Shape` base class and `Circle`, `Rectangle`,
`Triangle` subclasses with a polymorphic `area()` method.

## Module 4 — Arrays, Strings & Data Structures

**Objective:** Manipulate collections idiomatically.

**Strings**

- [ ] String methods — `slice`, `split`, `replace`, `replaceAll`,
      `includes`, `startsWith`, `padStart`
- [ ] Template literals and tagged templates

**Arrays**

- [ ] Mutating vs non-mutating methods
- [ ] `map`, `filter`, `reduce`, `flatMap`, `find`, `some`, `every`
- [ ] `forEach`, `sort`, `reverse`, `slice`, `splice`
- [ ] Array destructuring and spread `...`

**ES6+ data structures**

- [ ] `Map` and `WeakMap`
- [ ] `Set` and `WeakSet`
- [ ] **Typed arrays** — `Int32Array`, `Float64Array`, etc.

**Classic structures (implement from scratch)**

- [ ] Linked list, stack, queue, deque
- [ ] Priority queue / min-heap
- [ ] Sorting algorithms — bubble, merge, quick

**Exercise:** Implement a `Stack` and `Queue` class with `push`, `pop`,
and `peek`, then use them to evaluate a parenthesis-balance problem.

## Module 5 — DOM & Events

**Objective:** Make pages interactive.

**DOM**

- [ ] What the DOM is vs the source HTML
- [ ] Selecting elements — `getElementById`, `querySelector`,
      `querySelectorAll`
- [ ] Creating, inserting, removing nodes
- [ ] Modifying content — `textContent`, `innerHTML`, attributes,
      `classList`
- [ ] Traversal — `parentNode`, `children`, `nextElementSibling`

**Events**

- [ ] `addEventListener` and removing listeners
- [ ] **Event propagation** — capture and bubble phases
- [ ] **Event delegation** — one listener for many children
- [ ] `event.preventDefault()` and `event.stopPropagation()`
- [ ] Common events: click, input, submit, keydown, mouseenter, scroll
- [ ] Custom events — `new CustomEvent('foo', { detail })`

**BOM (Browser Object Model)**

- [ ] `window`, `location`, `history`, `navigator`
- [ ] `localStorage` and `sessionStorage`
- [ ] Cookies

**Exercise:** Build a click-counter button and an event-delegated todo
list (one listener handles add/delete/check).

## Module 6 — Asynchronous JavaScript

**Objective:** Stop fearing async code.

- [ ] **The event loop** — call stack, task queue, microtasks
- [ ] **Callbacks** — and "callback hell"
- [ ] **Promises** — `then`, `catch`, `finally`
- [ ] **Promise chaining** vs nesting
- [ ] **`Promise.all` / `allSettled` / `race` / `any`**
- [ ] **`async` / `await`** — and `try/catch` around them
- [ ] **`fetch`** — GET, POST, JSON, headers, abort
- [ ] **AbortController** — cancelling requests and timeouts
- [ ] `setTimeout`, `setInterval`, `queueMicrotask`,
      `requestAnimationFrame`

**Files:** [`lesson.js`](06-async/lesson.js) (promises, async/await) ·
[`combinators.js`](06-async/combinators.js) (all / allSettled / race / any) ·
[`abort.js`](06-async/abort.js) (cancellation and timeouts)

**Exercise:** Build a function that fetches three URLs in parallel with
`Promise.all`, then refactor it to retry each on failure up to 3 times.
Graded: `practice/exercises.js` → `promiseAll`, `retry`, `loadAll`.

## Module 7 — JSON, Regex & Validation

- [ ] **JSON** — what it is, what it isn't
- [ ] `JSON.parse()` and `JSON.stringify()` (replacer, space)
- [ ] JSON vs JavaScript object literals
- [ ] Reading JSON files in Node and the browser
- [ ] **Regular expressions** — literals, flags (`g`, `i`, `m`, `s`)
- [ ] Common patterns: email, URL, phone, password strength
- [ ] **Form validation** — required fields, formats, real-time feedback

**Exercise:** Write regex validators for email, URL, and a "strong
password" (≥8 chars, mixed case, digit, symbol).

## Module 8 — Error Handling & Debugging

- [ ] Error types — `Error`, `TypeError`, `RangeError`, `SyntaxError`,
      `ReferenceError`
- [ ] `try` / `catch` / `finally`
- [ ] `throw` statements
- [ ] **Custom error classes** — `class MyError extends Error`
- [ ] Error handling in promises and `async` functions
- [ ] **Debugging** — `console.log`, `console.table`, `debugger`,
      DevTools breakpoints, source maps

**Exercise:** Catch a `fetch` failure, classify it (network vs HTTP
error vs JSON parse), and re-throw a custom `ApiError`.

## Module 9 — Testing & Performance

**Testing**

- [ ] **Unit testing** with Jest / Vitest
- [ ] Test structure — `describe`, `it`, `expect`
- [ ] Mocks and spies
- [ ] Async test patterns

**Performance**

- [ ] Memory management — heap, stack, **garbage collection**
- [ ] Common memory leaks (event listeners, closures, detached DOM)
- [ ] **Lazy loading**
- [ ] **Debouncing** — for inputs and scroll
- [ ] **Throttling** — for rate-limited events
- [ ] Avoiding layout thrashing in the DOM

**Exercise:** Write `debounce(fn, ms)` and `throttle(fn, ms)` from
scratch, and add tests.

## Module 10 — Modern JS & Tooling

**Modern syntax (ES6+) recap**

- [ ] `let`/`const`, arrow functions, default/rest/spread
- [ ] Destructuring (object + array)
- [ ] Template literals
- [ ] **Modules** — `import` / `export`, ESM vs CommonJS
- [ ] Classes, getters/setters, private fields `#`
- [ ] Optional chaining `?.`, nullish coalescing `??`
- [ ] `globalThis`, top-level `await`
- [ ] `Symbol`, well-known symbols

**Tooling**

- [ ] **Node.js** runtime and `npm`/`pnpm`
- [ ] Bundlers — **Vite**, esbuild, webpack
- [ ] Transpilers — Babel, TypeScript
- [ ] Package management — `package.json`, semver, lockfiles
- [ ] **TypeScript basics** — types, interfaces, generics

**Exercise:** Convert one of your earlier scripts into a small Vite
package with ESM, TypeScript, and a Vitest test.

## Module 11 — Beginner Projects

Pick 3+ to build.

- [ ] Counter app
- [ ] Random number generator
- [ ] Prime number checker
- [ ] Unicode character value tool
- [ ] Palindrome checker
- [ ] Show/hide password toggle
- [ ] Email validator
- [ ] Random password generator
- [ ] Image carousel

## Module 12 — Intermediate Projects

- [ ] Toast notification system
- [ ] OTP input field
- [ ] Multi-step progress bar
- [ ] Student grade calculator
- [ ] Quiz app with timer
- [ ] Price range slider
- [ ] GitHub profile search (uses GitHub API)
- [ ] Sortable + filterable table
- [ ] Expense tracker (with `localStorage`)
- [ ] Dynamic resume builder

## Module 13 — Advanced Projects

- [ ] Tic-Tac-Toe game
- [ ] QR code generator
- [ ] QR code scanner
- [ ] Image resize and compression in-browser
- [ ] Task scheduler
- [ ] Nested chat comments
- [ ] Employee database management UI
- [ ] Responsive admin dashboard

## Module 14 — Ecosystem Tour

You don't need to learn all of these — pick a path.

**Frontend libraries**

- [ ] React, Preact, Vue
- [ ] Lodash, Day.js (modern Moment.js replacement), Axios

**Frontend frameworks**

- [ ] Next.js, Nuxt.js, Astro, Remix, Gatsby

**Backend**

- [ ] Express.js, Fastify, NestJS, Koa, Hono
- [ ] WebSockets — Socket.io, `ws`
- [ ] Auth — JWT, Passport.js, bcrypt
- [ ] CORS

**Full-stack**

- [ ] Next.js, Nuxt, RedwoodJS, T3 stack

**Other domains**

- [ ] Mobile — React Native, Expo
- [ ] Desktop — Electron, Tauri
- [ ] Game dev — Phaser
- [ ] Web scraping — Puppeteer, Playwright
- [ ] Real-time — WebRTC, WebSockets

## Module 15 — Interview Prep

- [ ] Beginner questions — var/let/const, hoisting, `==` vs `===`,
      type coercion
- [ ] Intermediate — closures, prototypes, `this`, event loop
- [ ] Advanced — generators, proxies, memory model
- [ ] Output prediction questions
- [ ] **Top 50 array coding problems**
- [ ] String manipulation problems
- [ ] Object-design problems
- [ ] System design lite — debounce, throttle, EventEmitter from scratch

---

## Reference Cheatsheet

```js
// Modern variable declarations
const PI = 3.14
let count = 0

// Destructuring
const { name, age = 18 } = user
const [first, ...rest] = items

// Spread
const merged = { ...a, ...b }
const concat = [...arr1, ...arr2]

// Arrow + implicit return
const double = x => x * 2

// Optional chaining + nullish coalescing
const city = user?.address?.city ?? 'Unknown'

// Async + fetch
async function getUser(id) {
  const res = await fetch(`/api/users/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// Promise.all
const [a, b] = await Promise.all([fetchA(), fetchB()])

// Map + filter + reduce
const total = items
  .filter(i => i.active)
  .map(i => i.price)
  .reduce((sum, p) => sum + p, 0)

// Module
export function add(a, b) { return a + b }
import { add } from './math.js'
```

**Useful built-ins**

| Object | Purpose |
|---|---|
| `Array` | Lists and array methods |
| `Object` | Key-value structures, `Object.keys/values/entries` |
| `Map` / `Set` | Keyed/unique collections |
| `Promise` | Async values |
| `JSON` | Parse / stringify |
| `Math` | Math utilities |
| `Date` | Dates and times |
| `RegExp` | Regular expressions |
| `Intl` | Internationalization (dates, numbers, currency) |
| `URL` / `URLSearchParams` | URL parsing |

**Run-anywhere safety preamble (Node ESM)**

```js
// package.json: { "type": "module" }
import process from 'node:process'
process.on('unhandledRejection', err => { throw err })
```

---

## Source

Curriculum scraped and reorganized from:
**GeeksforGeeks — JavaScript Tutorial**
<https://www.geeksforgeeks.org/javascript/javascript/>

Authoritative reference:
- **MDN Web Docs** — <https://developer.mozilla.org/en-US/docs/Web/JavaScript>
- **ECMAScript spec** — <https://tc39.es/ecma262/>
- **Node.js docs** — <https://nodejs.org/api/>
