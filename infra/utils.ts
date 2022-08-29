export function getRelativeUrl(url: URL, rootDir: string): string {
  const root = new URL(rootDir, 'file://').href;
  return url.href.replace(root, '.');
}
