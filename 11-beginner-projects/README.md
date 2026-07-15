# Module 11 — Beginner Projects

Small, focused projects that lock in fundamentals. Pick at least three. Ship
each one all the way to green tests before moving on.

## Structure

Each project follows the same layout:

```text
project-XX/
├── README.md        — requirements, acceptance criteria
├── src/             — your implementation
├── tests/           — Node's built-in test runner
├── assets/          — screenshots, HTML shell, sample data
└── solution/        — reference implementation (peek only after)
```

## Projects

| # | Name                         | Modules exercised          |
|---|------------------------------|----------------------------|
| 01 | Counter app                 | 1, 5                      |
| 02 | Password strength meter     | 1, 4, 7                   |
| 03 | Palindrome checker          | 1, 4                      |
| 04 | Random password generator   | 1, 2, 7                   |
| 05 | Email validator             | 4, 7                      |
| 06 | Show/hide password toggle   | 5                         |
| 07 | Prime number checker        | 1                         |
| 08 | Unicode character tool      | 1, 4                      |
| 09 | Image carousel              | 5                         |

Only projects 01–03 ship with full scaffolding today; the rest are on the
menu — treat this file as your backlog.

## Workflow

1. Read `project-XX/README.md`.
2. Write your solution in `src/`.
3. Run `node --test project-XX/tests/`.
4. Compare with `solution/` only after your tests pass.
5. Add screenshots / assets to `assets/`.
