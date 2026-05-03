/** Plain text from API HTML snippets (e.g. show or episode summary). */
export const stripHtml = (html: string): string => {
  if (typeof document === 'undefined') {
    return html
      .replaceAll(/<[^>]+>/g, ' ')
      .replaceAll(/\s+/g, ' ')
      .trim()
  }

  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent?.replaceAll(/\s+/g, ' ').trim() ?? ''
}
