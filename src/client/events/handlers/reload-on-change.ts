import { registerHandler } from './_create-handler.ts';
import { Dinovel } from 'dinovel/engine/dinovel.ts';

registerHandler('cssLoaded', () => {
  if (Dinovel.runtime.config.mode === 'prod') return;

  const links = document.getElementsByTagName('link');
    for (const l of links) {
      if (l.rel == 'stylesheet') {
        l.href = l.href + '?v=' + new Date().getTime();
      }
    }

    Dinovel.logger.engine('css loaded');
})

registerHandler('scriptLoaded', () => {
  if (Dinovel.runtime.config.mode === 'prod') return;
  window.location.reload();
});
