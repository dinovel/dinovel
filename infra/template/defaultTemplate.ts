import { NAME_BODY, NAME_BODY_ATTRIBUTES, NAME_HEAD, NAME_HEAD_ATTRIBUTES, NAME_HTML_ATTRIBUTES } from './options.ts';

export const DEFAULT_TEMPLATE = /* html */`
<!DOCTYPE html>
<html ${NAME_HTML_ATTRIBUTES} >
  <head ${NAME_HEAD_ATTRIBUTES} >
    ${NAME_HEAD}
  </head>
  <body ${NAME_BODY_ATTRIBUTES} >
    ${NAME_BODY}
  </body>
</html>
`
