/**
 * Build a URL, using the main module as base
 *
 * @param file relative path to the file
 * @returns {URL}
 */
export function buildURL(file: string): URL {
  return new URL(file, Deno.mainModule);
}
