import { toHtmlObject } from 'dinovel/render/helpers.ts';
import { MenuItem } from 'dinovel/widgets/_models.ts';

export interface ViewBuilderOptions {
  styles?: string[];
  scripts?: string[];
  title?: string;
}

const menuOptions: MenuItem[] = [
  {
    event: 'nav-home',
    label: 'Home',
  },
  {
    event: 'nav-comps',
    label: 'Components',
  },
  {
    event: 'nav-res',
    label: 'Resources',
  }
];

export function buildView(body: string, options: ViewBuilderOptions = {}): string {
  const { styles = [], scripts = [], title = '' } = options;
  styles.push('/static/libs/styles.css');
  scripts.push('/static/libs/main.js');

  return /*html*/`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <link rel="icon" href="/static/logo.svg">
  <title>${title}</title>
  ${styles.map(style => `<link rel="stylesheet" href="${style}">`).join('\n')}
</head>
<body>
  <dn-collapse-menu items="${toHtmlObject(menuOptions, [])}"></dn-collapse-menu>
  ${body}
  ${scripts.map(script => `<script src="${script}"></script>`).join('\n')}
</body>
</html>`;
}
