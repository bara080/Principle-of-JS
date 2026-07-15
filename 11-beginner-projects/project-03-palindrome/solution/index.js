export function isPalindrome(str) {
  if (typeof str !== 'string') return false
  const normalized = str.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '')
  const reversed = [...normalized].reverse().join('')
  return normalized === reversed
}

export function longestPalindromicSubstring(str) {
  if (typeof str !== 'string' || !str) return ''
  let best = ''
  const chars = [...str]
  for (let i = 0; i < chars.length; i++) {
    for (const [lo0, hi0] of [[i, i], [i, i + 1]]) {
      let lo = lo0, hi = hi0
      while (lo >= 0 && hi < chars.length && chars[lo].toLowerCase() === chars[hi].toLowerCase()) {
        lo--
        hi++
      }
      const substr = chars.slice(lo + 1, hi).join('')
      if (substr.length > best.length) best = substr
    }
  }
  return best
}
