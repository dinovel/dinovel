import type { Plugin, DinovelCore } from 'dinovel/engine/mod.ts';

export class ReloadEventsPlugin implements Plugin {
  name = 'reload-events';
  inject(core: DinovelCore): void {
    core.events.on('reload').subscribe(k => {
      if (k === 'script') {
        window.location.reload();
      } else {
        const elem = document.getElementById('dn-style') as HTMLLinkElement;
        const random = Math.random();
        elem.href = `/style.css?${random}`;
      }
    });
    core.events.on('started').subscribe(() => {
      window.location.reload()
    });
  }
}
