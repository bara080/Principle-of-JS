# Coding

LeetCode-style problems, framed for JS.

## Structure

Each problem lives in its own file under this folder:

```
coding/
├── README.md
├── two-sum.js
├── valid-parentheses.js
├── group-anagrams.js
└── ...
```

Every file exports the solution and includes an inline self-check.

## Approach

1. Read the problem twice. Restate it aloud.
2. State input constraints. Ask about edge cases.
3. Write a slow, correct solution. Verify with examples.
4. Only then optimize. Explain the tradeoff (time vs space).
5. Analyze Big-O.

## Categories to practice

- **Arrays** — two-sum, product except self, rotate, merge intervals.
- **Strings** — anagram groups, longest substring without repeat, palindrome variants.
- **Hashing** — subarray sums, first non-repeating.
- **Two pointers** — remove duplicates, container with most water.
- **Sliding window** — max sum of k, min window substring.
- **Trees** — traversals, level-order, LCA.
- **Graphs** — BFS/DFS, cycle detection.
- **DP** — climbing stairs, coin change, LIS.

## Rules

- Time-box. 30 min to solve, 15 min to optimize.
- Talk through your reasoning before typing.
- Return a value; don't just `console.log`.

## First problems to try

- `two-sum.js` — the classic. Warm-up.
- Add more as you go. Track your Big-O for each.
