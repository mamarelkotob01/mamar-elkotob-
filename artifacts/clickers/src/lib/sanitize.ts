/**
 * sanitizeHTML: A lightweight defense-in-depth sanitizer.
 * Removes <script>, onAttributes, and other XSS vectors.
 * Kept in a separate file so that security.tsx (which exports a React component)
 * stays HMR-compatible with Vite Fast Refresh.
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  return html
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers (onclick, onerror, etc)
    .replace(/\s+on\w+="[^"]*"/gi, '')
    .replace(/\s+on\w+='[^']*'/gi, '')
    .replace(/\s+on\w+=[^\s>]+/gi, '')
    // Remove javascript: pseudo-protocol
    .replace(/javascript:/gi, '[removed]')
    // Remove iframe/object/embed/base
    .replace(/<(?:iframe|object|embed|base)\b[^>]*>/gi, '')
    .replace(/<\/(?:iframe|object|embed|base)>/gi, '');
}
