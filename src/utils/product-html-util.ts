/**
 * Sanitizes supplier-entered product description HTML.
 *
 * Removes <a> tags whose text content is only whitespace or punctuation
 * (preserving their inner text), preventing nameless links that would
 * fail WCAG 2.4.4 (Link Purpose, Level A).
 *
 * Also strips script/style injection and inline event handlers.
 */
export function sanitizeProductDescription(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/ on[a-z]+=('[^']*'|"[^"]*")/gi, '')
    .replace(/javascript:|data:|vbscript:/gi, '')
    .replace(/<a\b[^>]*>([\s.,:;!?]*)<\/a>/gi, '$1')
}
