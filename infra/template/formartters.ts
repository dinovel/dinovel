export function css(names: string[]): string[] {
  return names.map((name) =>
    (`<link rel="stylesheet" href="/${name}.css" type="text/css" >`));
}

export function js(names: string[]): string[] {
  return names.map((name) =>
    (`<script src="/${name}.mjs" type="module" ></script>`));
}
