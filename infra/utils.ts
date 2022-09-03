export function getRelativeUrl(url: URL, rootDir: string): string {
  const root = new URL(rootDir, 'file://').href;
  return url.href.replace(root, '.');
}

export function buildUrl(relativePath: string): URL {
  return new URL(relativePath, Deno.mainModule);
}

export function getUniqueName(prefix = ''): string {
  return `${prefix}${crypto.randomUUID().replace(/-/g, '')}`;
}
