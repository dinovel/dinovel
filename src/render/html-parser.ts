/** Parse html string and return first child */
export function h<T extends HTMLElement>(html: string): T {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html.trim(), 'text/html');
  return doc.body.firstChild as T;
}
