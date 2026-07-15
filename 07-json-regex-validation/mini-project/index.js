// Module 07 — mini-project — tiny schema library (stub)

export const s = {
  string() { return new StringSchema() },
  number() { return new NumberSchema() },
  enum(values) { return new EnumSchema(values) },
  object(shape) { return new ObjectSchema(shape) },
}

class StringSchema {
  parse(_input) { throw new Error('TODO: StringSchema#parse') }
}
class NumberSchema {
  parse(_input) { throw new Error('TODO: NumberSchema#parse') }
}
class EnumSchema {
  constructor(values) { this.values = values }
  parse(_input) { throw new Error('TODO: EnumSchema#parse') }
}
class ObjectSchema {
  constructor(shape) { this.shape = shape }
  parse(_input) { throw new Error('TODO: ObjectSchema#parse') }
}
