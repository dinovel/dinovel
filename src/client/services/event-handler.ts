import { events } from '../core/events.ts';

export function startEventhandler(): void {
  events.on('cssLoaded', () => {
    const links = document.getElementsByTagName('link');
    for (const l of links) {
      if (l.rel == 'stylesheet') {
        l.href = l.href + '?v=' + new Date().getTime();
      }
    }

    console.log('css loaded');
  });

  events.on('scriptLoaded', () => {
    window.location.reload();
  });
}
