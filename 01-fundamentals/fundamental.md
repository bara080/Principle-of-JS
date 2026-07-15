You are a senior JavaScript engineer and technical educator.

Review and rebuild the following JavaScript learning module so it is:

- Practical and project-based
- Modern, using current JavaScript and Node.js practices
- Relevant to real production applications
- Useful for day-to-day frontend, backend, React, React Native, and Node.js development
- Focused on writing clean, maintainable, secure, and testable code

Current module:

```js
// Module 01 — fundamentals
// Run: node 01-fundamentals/lesson.js
//
// Objective: Read and write basic JavaScript with confidence.
//
// Checklist:
//   [ ] Variables — var vs let vs const
//   [ ] Data types — string, number, boolean, null, undefined, BigInt, Symbol, object
//   [ ] Type conversion — coercion, Number(), String(), Boolean(), === vs ==
//   [ ] Operators — arithmetic, comparison, logical, ternary, ?? and ?.
//   [ ] Control flow — if/else, switch
//   [ ] Loops — for, while, do...while, for...in, for...of
//   [ ] Scope — global, function, block, lexical
//
// Write your notes and runnable examples here. Type every example out — do not
// paste it. The exercises live in 01-fundamentals/exercises.js.

console.log("fundamentals — start here");
```

Improve the module using these requirements:

1. Keep the fundamentals, but explain where each concept is used in real applications.
2. Prioritize `const` and `let`; explain why `var` is normally avoided.
3. Include realistic examples such as:
   - User registration validation
   - Shopping-cart totals
   - API response handling
   - Environment configuration
   - Permissions and roles
   - Filtering and processing database records
   - Handling optional or missing values

4. Explain common production bugs involving:
   - `null` versus `undefined`
   - Loose equality
   - Type coercion
   - Floating-point calculations
   - Object and array mutation
   - Incorrect loop selection
   - Variable scope

5. Include defensive programming and input validation.
6. Show modern syntax such as:
   - Optional chaining
   - Nullish coalescing
   - Template literals
   - Destructuring
   - Spread syntax
   - Array methods where appropriate

7. Do not teach outdated patterns as recommended practices.
8. Add short debugging exercises based on realistic bugs.
9. Add one practical mini-project that combines all concepts.
10. Include expected outputs and simple assertions so learners can verify their work.

Create the following files:

```text
01-fundamentals/
├── README.md
├── lesson.js
├── examples.js
├── exercises.js
├── solutions.js
└── mini-project/
    ├── order-processor.js
    └── order-processor.test.js
```

For each topic, use this structure:

```text
1. Concept
2. Why it matters in production
3. Practical example
4. Common mistake
5. Exercise
6. Expected result
```

The mini-project should build a small production-style order-processing system that:

- Validates an order
- Validates customer information
- Calculates subtotal, tax, discount, and final total
- Handles missing optional data
- Checks user permissions
- Processes multiple products
- Returns a structured result
- Handles invalid input without crashing
- Includes tests using Node.js built-in assertions

Use plain modern JavaScript and Node.js first. Do not introduce frameworks yet.

Generate complete, runnable code rather than only explanations. Keep the explanations concise, but make the exercises challenging enough to build practical engineering skills.
