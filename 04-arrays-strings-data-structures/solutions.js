// Module 04 — solutions

export class Stack {
  #data = []
  push(v) { this.#data.push(v) }
  pop() { return this.#data.pop() }
  peek() { return this.#data.at(-1) }
  get size() { return this.#data.length }
}

export class Queue {
  #inbox = []
  #outbox = []
  enqueue(v) { this.#inbox.push(v) }
  dequeue() {
    if (this.#outbox.length === 0) {
      while (this.#inbox.length) this.#outbox.push(this.#inbox.pop())
    }
    return this.#outbox.pop()
  }
  get size() { return this.#inbox.length + this.#outbox.length }
}

export function isBalanced(str) {
  const pairs = { ')': '(', ']': '[', '}': '{' }
  const stack = new Stack()
  for (const ch of str) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch)
    else if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false
    }
  }
  return stack.size === 0
}
