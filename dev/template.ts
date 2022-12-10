import { buildLiveReloadOptions, LiveReloadOptions } from './live-reload/mod.ts';
import { DinovelConfig } from './options.ts';

export const LIVE_RELOAD_SCRIPT = `/live-reload.js`;

const RELOAD_SCRIPT = `
<script type="module">
  import { LiveReload } from "${LIVE_RELOAD_SCRIPT}";

  const liveReload = new LiveReload({
    endpoint: "__ENDPOINT__",
    reloadEvent: "__RELOAD_EVENT__",
    enableLogging: __ENABLE_LOGGING__,
  });

  liveReload.start();
</script>
`.trim();

export function getLiveReloadScript(options: LiveReloadOptions): string {
  return RELOAD_SCRIPT
    .replace('__ENDPOINT__', options.endpoint)
    .replace('__RELOAD_EVENT__', options.reloadEvent)
    .replace('__ENABLE_LOGGING__', options.enableLogging.toString());
}

export function buildTemplate(opt: DinovelConfig): string {
  const reloadOptions = buildLiveReloadOptions();

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${opt.title}</title>
  </head>
  <body>
    ${opt.watch ? getLiveReloadScript(reloadOptions) : ''}
    <script type="module" src="/main.js"></script>
  </body>
</html>
`.trim();
}
