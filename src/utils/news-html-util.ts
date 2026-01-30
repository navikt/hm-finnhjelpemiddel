// filepath: /Users/Aasmund.Nordstoga/dev/hm-finnhjelpemiddel/src/utils/news-html-util.ts
// Utilities to sanitize and build a structured HTML preview for news content.
// Intentionally simple regex-based approach (not a full HTML parser) but keeps basic structure.

// Allowed structural/inline tags we preserve
const ALLOWED_TAGS = ['p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'a']

// Basic sanitizer similar to article page; strips script/style tags and event handlers
export function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/ on[a-z]+=('[^']*'|"[^"]*")/gi, '')
    .replace(/javascript:|data:|vbscript:/gi, '');
}

// Remove disallowed tags but keep their inner text
function stripDisallowedTags(html: string): string {
  // Replace start tags not in allowed list with just their inner content marker removal
  return html
    .replace(/<([^\s>\/]+)([^>]*)>/gi, (match, tag) => {
      const lower = tag.toLowerCase()
      if (ALLOWED_TAGS.includes(lower)) {
        if (lower === 'a') {
          const hrefMatch = match.match(/href=("[^"]*"|'[^']*')/i)
          if (hrefMatch) {
            const hrefVal = hrefMatch[1]
            if (/(javascript:|data:|vbscript:)/i.test(hrefVal)) return '<a class="news-preview-link">'
            return `<a ${hrefMatch[0]} class="news-preview-link">`
          }
          return '<a class="news-preview-link">'
        }
        return `<${lower}>`
      }
      return ''
    })
    .replace(/<\/(.*?)>/gi, (match, tag) => {
      const lower = tag.toLowerCase()
      return ALLOWED_TAGS.includes(lower) ? `</${lower}>` : ''
    });
}

interface PreviewResult {
  previewHtml: string
  truncated: boolean
}

// Build structured preview: keep allowed tags, truncate text content at limit, close any open tags, append ellipsis if truncated.
export function buildNewsPreview(html: string, textLimit: number): PreviewResult {
  const sanitized = stripDisallowedTags(sanitize(html))
  if (!sanitized.trim()) return { previewHtml: '', truncated: false }

  const tokens = sanitized.match(/<[^>]+>|[^<]+/g) || []
  let textCount = 0
  let truncated = false
  const output: string[] = []
  const openTags: string[] = []

  for (const token of tokens) {
    if (token.startsWith('<')) {
      // Tag
      if (/^<\//.test(token)) {
        // closing
        const tagName = token.replace(/^<\//, '').replace(/>.*$/, '').toLowerCase()
        // Only include if currently open
        const idx = openTags.lastIndexOf(tagName)
        if (idx !== -1) {
          // Pop until this tag (should be last ideally)
          openTags.splice(idx, 1)
          output.push(token)
        }
      } else {
        // opening (ignore self-closing for our allowed set which we don't use)
        const tagName = token.replace(/^</, '').replace(/>.*$/, '').toLowerCase()
        if (ALLOWED_TAGS.includes(tagName)) {
          openTags.push(tagName)
          output.push(token)
        }
      }
    } else {
      // Text node
      const remaining = textLimit - textCount
      if (remaining <= 0) {
        truncated = true
        break
      }
      if (token.length <= remaining) {
        output.push(token)
        textCount += token.length
      } else {
        // Need to truncate this text token
        const slice = token.slice(0, remaining)
        // Avoid cutting mid-word: backtrack to last space if next char is letter
        let adjusted = slice
        if (/\S/.test(token.charAt(remaining))) {
          const lastSpace = slice.lastIndexOf(' ')
          if (lastSpace > 40) adjusted = slice.slice(0, lastSpace) // avoid shrinking too much
        }
        adjusted = adjusted.replace(/[,;:.!?]*$/, '').trimEnd() + '…'
        output.push(adjusted)
        truncated = true
        break
      }
    }
  }

  if (truncated) {
    // Close any still-open tags in reverse order
    for (let i = openTags.length - 1; i >= 0; i--) {
      output.push(`</${openTags[i]}>`)
    }
  }

  // Wrap preview in a single container if it doesn't start with a block tag
  const joined = output.join('')
  const startsWithBlock = /^\s*<(p|ul|ol)\b/i.test(joined)
  const previewHtml = startsWithBlock ? joined : `<p>${joined}</p>`
  // Add wrapping span class for styling anchors inside
  return { previewHtml, truncated }
}
