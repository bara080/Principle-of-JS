# Project 02 — Password Strength Meter

Return a score 0–4 plus per-rule pass/fail feedback for a password. Follows
NIST-friendly rules — length matters more than character classes, common
passwords are rejected outright.

## Acceptance criteria

- `assess(password)` returns
  `{ score: 0..4, checks: { longEnough, hasVariety, notCommon, notPersonal }, feedback: string[] }`.
- Optional context: `assess(password, { userInfo: ['ada', 'lovelace'] })`
  penalizes passwords containing user data.
- Passwords in the `assets/top-100.json` list score 0 regardless of length.

Run: `node --test 11-beginner-projects/project-02-password-strength/tests/`.
