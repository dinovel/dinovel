export interface ViewBuilderOptions {
  styles?: string[];
  scripts?: string[];
  title?: string;
}

export function buildView(body: string, options: ViewBuilderOptions = {}): string {
  const { styles = [], scripts = [], title = '' } = options;
  styles.push('/static/libs/styles.css');
  scripts.push('/static/libs/dinovel.js');

  return /*html*/`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <link rel="icon" href="/assets/logo.png">
  <title>${title}</title>
  ${styles.map(style => `<link rel="stylesheet" href="${style}">`).join('\n')}
</head>
<body>
  ${body}
  ${scripts.map(script => `<script src="${script}"></script>`).join('\n')}
</body>
</html>`;
}
