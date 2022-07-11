// deno-lint-ignore-file no-explicit-any
export type COLOR = 'white' | 'red' | 'yellow' | 'blue' | 'pink' | 'grey';

export function applyColor(color: COLOR, message: any[]): any[] {
  const isBrowser = typeof globalThis.document === 'object';
  return isBrowser ? applyBrowserColor(color, message) : applyServerColor(color, message);
}

// =============== SERVER ======================

function applyServerColor(color: COLOR, message: any[]): any[] {
  return [getServerColor(color), ...message, '\x1b[0m'];
}

function getServerColor(color: COLOR): string {
  switch (color) {
    case 'white':
      return '\x1b[37m';
    case 'red':
      return '\x1b[31m';
    case 'yellow':
      return '\x1b[33m';
    case 'blue':
      return '\x1b[36m';
    case 'pink':
      return '\x1b[35m';
    case 'grey':
      return '\x1b[90m';
  }
}

// =============== BROWSER ======================

function applyBrowserColor(color: COLOR, message: any[]): any[] {
  const toIgnore: COLOR[] = ['red', 'yellow'];
  if (toIgnore.includes(color)) { return message; }

  const c = BROWSER_COLOR[color];
  const res: any[] = [];

  for (const m of message) {
    if (typeof m === 'string') {
      res.push(`%c${m}`);
    } else {
      res.push(m);
    }
  }
  res.push(c);

  return res;
}

const BROWSER_COLOR: { [key in COLOR]: string } = {
  red: '',
  yellow: '',
  blue: 'color: #4c79c4;',
  grey: 'color: #a1a1a1;',
  pink: 'color: #ff3f81;',
  white: '',
}
