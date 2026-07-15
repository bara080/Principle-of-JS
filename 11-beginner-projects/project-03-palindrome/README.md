# Project 03 — Palindrome Checker

Classic. Ignore case, spaces, and punctuation. Handle Unicode correctly.

## API

```js
isPalindrome('A man, a plan, a canal: Panama')  // true
isPalindrome('race a car')                       // false
isPalindrome('')                                  // true (empty is trivially)
isPalindrome('Élé')                               // true (Unicode-aware)
```

## Extension

- `longestPalindromicSubstring(str)` — return the longest palindromic
  substring. O(n²) is fine.

Run: `node --test 11-beginner-projects/project-03-palindrome/tests/`.
