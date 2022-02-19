import { Dinovel } from 'dinovel/engine/dinovel.ts';

import { PublicEvents } from 'dinovel/server/shared/events.ts';

export function startEventhandler(): void {
  const handler = Dinovel.events.add<PublicEvents>();

  handler.on('cssLoaded', () => {
    const links = document.getElementsByTagName('link');
    for (const l of links) {
      if (l.rel == 'stylesheet') {
        l.href = l.href + '?v=' + new Date().getTime();
      }
    }

    console.log('css loaded');
  });

  handler.on('scriptLoaded', () => {
    window.location.reload();
  });
}
