export function css(names: string[]): string[] {
  return names.map((name) =>
    (`<link rel="stylesheet" href="/assets/${name}.css" type="text/css" >`));
}

export function js(names: string[]): string[] {
  return names.map((name) =>
    (`<script src="/assets/${name}.js" type="module" ></script>`));
}
