import type { Plugin, DinovelCore, Server } from 'dinovel/engine/mod.ts';

export const HTML_TOKEN_TITLE = '__TITLE__';
export const HTML_TOKEN_STYLE = '__STYLE__';
export const HTML_TOKEN_SCRIPTS = '__SCRIPTS__';

const DEFAULT_HOME_PAGE = /*html*/`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="/assets/logo.png" />
    <title>${HTML_TOKEN_TITLE}</title>
    ${HTML_TOKEN_STYLE}
  </head>
  <body>
    <div id="app"></div>
    ${HTML_TOKEN_SCRIPTS}
  </body>
</html>
`;

export class ServeHomePlugin implements Plugin {
  name = 'serve-home';

  #html: string;

  constructor(html?: string) {
    this.#html = html ?? DEFAULT_HOME_PAGE;
  }

  inject(core: DinovelCore): void {
    const server = core.engine as Server;
    const scripts = server.scripts;

    let scriptsImports = '';
    for (const [name, _] of scripts.entries()) {
      const path = `/${name}.js`;
      scriptsImports += /*html*/`<script src="${path}" ></script>\n`;
    }
    let styleImport = /*html*/`<link class="dn-style" rel="stylesheet" href="/style.css">\n`;
    if (server.styles.useDinovel)
      styleImport += /*html*/`<link class="dn-style" rel="stylesheet" href="/dinovel.css">\n`;

    const htmlResponse = this.#html
      .replace(HTML_TOKEN_TITLE, core.engine.title)
      .replace(HTML_TOKEN_STYLE, styleImport)
      .replace(HTML_TOKEN_SCRIPTS, scriptsImports);

    server.router.get('/', ctx => {
      ctx.response.body = htmlResponse;
      ctx.response.headers.set('Content-Type', 'text/html');
    });
  }
}
