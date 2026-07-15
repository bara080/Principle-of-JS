# Concepts — JSON, Regex & Validation

> Status: outline.

## JSON — what it is (and isn't)

- Data-only format. **No** functions, `undefined`, comments, trailing commas,
  `NaN`/`Infinity`, cycles.
- `Date` becomes an ISO string. Parsing back doesn't restore the `Date`.
- `undefined` values and keys are **dropped** during serialization.

### API

```js
JSON.stringify(value, replacer?, space?)
JSON.parse(text, reviver?)
```

- `replacer` — `(key, value) => newValue` for filtering / masking.
- `space` — indentation (number or string) for pretty output.
- `reviver` — transform values as they parse; return `undefined` to drop.

### Safety

Never `JSON.parse` user input without a `try`. Consider `structuredClone` for
deep copying in-memory data rather than JSON round-trip (preserves types,
faster, cycle-safe).

## Regex — the useful parts

- `/pattern/flags` — literal.
- Flags: `g` global, `i` case-insensitive, `m` multiline, `s` dotall, `u` unicode.
- Anchors: `^` start, `$` end.
- Character classes: `[a-z]`, `\d`, `\w`, `\s`.
- Quantifiers: `?` `*` `+` `{n,m}`. `?` after them makes them lazy.
- Groups: `(?:...)` non-capturing; `(?<name>...)` named; `(?=...)` lookahead.

### Patterns you'll actually use

- Slug: `/^[a-z0-9-]+$/`
- Hex color: `/^#[0-9a-f]{6}$/i`
- ISO date: `/^\d{4}-\d{2}-\d{2}$/`
- 2-letter country: `/^[A-Z]{2}$/`

### Anti-patterns

- Email regex: don't. Use `str.includes('@')` + confirmation email.
- Overly permissive URL regex: use `new URL(str)` in a `try`.
- Catastrophic backtracking: nested quantifiers on optional groups (`(a+)+$`)
  can hang the process on adversarial input.

## Validation strategy

1. **Coerce** at the boundary (`Number.parseInt`, `String(input)`).
2. **Shape check** — is it an object? An array? The expected keys?
3. **Field validation** — length, range, pattern, enum.
4. **Cross-field checks** — `endsAt > startsAt`, `email === confirmEmail`.
5. **Whitelist unknown keys**, never blacklist.

## Common Interview Questions

1. Parse a JSON string that might have extra whitespace, comments, or trailing commas — how?
2. Write a regex for a valid slug.
3. What's ReDoS? Show an example.
4. Difference between `structuredClone` and `JSON.parse(JSON.stringify(x))`.
5. When would you use a schema library vs hand-rolled validation?
