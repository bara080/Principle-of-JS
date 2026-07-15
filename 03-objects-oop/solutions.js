// Module 03 — solutions
// Reference implementations for exercises. Fill in as exercises are expanded.

export class Shape {
  constructor(name) { this.name = name }
  area() { throw new Error('area() must be implemented by subclass') }
  describe() { return `${this.name} with area ${this.area()}` }
}

export class Circle extends Shape {
  constructor(radius) {
    super('Circle')
    if (!Number.isFinite(radius) || radius <= 0) throw new TypeError('radius must be > 0')
    this.radius = radius
  }
  area() { return Math.PI * this.radius ** 2 }
}

export class Rectangle extends Shape {
  constructor(width, height) {
    super('Rectangle')
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      throw new TypeError('width and height must be > 0')
    }
    this.width = width
    this.height = height
  }
  area() { return this.width * this.height }
}

export class Triangle extends Shape {
  constructor(base, height) {
    super('Triangle')
    if (!Number.isFinite(base) || !Number.isFinite(height) || base <= 0 || height <= 0) {
      throw new TypeError('base and height must be > 0')
    }
    this.base = base
    this.height = height
  }
  area() { return (this.base * this.height) / 2 }
}
