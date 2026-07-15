# Cheatsheet — DOM & Events

## Select

```js
document.getElementById('id')
document.querySelector('.card')
document.querySelectorAll('.row')   // static NodeList
el.closest('.card')                 // walk up to matching ancestor
```

## Mutate — safely

```js
el.textContent = 'Hi ' + name       // safe
el.innerHTML = trustedHtml          // ⚠️ NEVER on user input
el.setAttribute('aria-label', 'x')
el.dataset.id = orderId             // sets data-id="…"
el.classList.add('active')
el.classList.toggle('open', isOpen)
el.append(child)
el.remove()
```

## Create nodes

```js
const li = document.createElement('li')
li.textContent = product.name
li.dataset.sku = product.sku
list.append(li)

const frag = document.createDocumentFragment()
for (const p of products) frag.append(makeRow(p))
list.append(frag)                   // one reflow
```

## Events

```js
el.addEventListener('click', onClick, { once: true })
el.removeEventListener('click', onClick)
el.addEventListener('scroll', onScroll, { passive: true })

// Delegation
list.addEventListener('click', (e) => {
  const row = e.target.closest('[data-id]')
  if (!row) return
  handle(row.dataset.id)
})
```

## Storage

```js
localStorage.setItem('key', JSON.stringify(value))
const value = JSON.parse(localStorage.getItem('key') ?? 'null')
localStorage.removeItem('key')
```

## Forms

```js
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(form))
  submit(data)
})
```

## Common patterns

```js
// Click outside
document.addEventListener('click', (e) => {
  if (!menu.contains(e.target)) menu.hidden = true
})

// Debounced input
input.addEventListener('input', debounce((e) => search(e.target.value), 200))
```

## Interview tips

- Delegation shines when the list is large or dynamic.
- `passive: true` is required for touch/scroll performance.
- `once: true` auto-removes after one fire — great for one-shot handlers.
