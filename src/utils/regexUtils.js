export function buildRegex(pattern, flags = 'i') {
  if (!pattern) return null
  try {
    return new RegExp(pattern, flags)
  } catch {
    return null
  }
}

export function highlightMatches(text, regex) {
  if (!regex) return [{ text, match: false }]
  const parts = []
  let last = 0
  let m
  const r = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g')
  while ((m = r.exec(text)) !== null) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), match: false })
    parts.push({ text: m[0], match: true })
    last = r.lastIndex
    if (m[0].length === 0) { r.lastIndex++; continue }
  }
  if (last < text.length) parts.push({ text: text.slice(last), match: false })
  return parts
}
