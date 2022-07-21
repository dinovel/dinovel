import type { Plugin, DinovelCore } from 'dinovel/engine/mod.ts';

export class ReloadEventsPlugin implements Plugin {
  name = 'reload-events';
  inject(core: DinovelCore): void {
    core.events.on('reload').subscribe(k => {
      if (k === 'script') {
        window.location.reload();
      } else {
        const elems = document.querySelectorAll('.dn-style');
        elems.forEach(e => reloadPath(e as HTMLLinkElement));
      }
    });
    core.events.on('started').subscribe(() => {
      window.location.reload()
    });
  }
}

function reloadPath(elem: HTMLLinkElement): void {
  const random = Math.random();
  const refValue = elem.href.split('?')[0];
  elem.href = `${refValue}?${random}`;
}
