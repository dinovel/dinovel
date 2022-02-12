import { useDinovel } from 'dinovel/engine/dinovel.ts';

import { PUBLIC_EVENT_NAME } from '../../shared/events.ts';

export function startEventListner(reload = false) {
  const evSource = new EventSource('/sse');

  evSource.addEventListener(PUBLIC_EVENT_NAME, e => {
    // deno-lint-ignore no-explicit-any
    const event = (e as any).data;
    useDinovel().events.emit(event);
  });

  evSource.onerror = () => {
    console.warn('EventSource error, trying to reconnect...');
    evSource?.close();

    setTimeout(() => {
      startEventListner(true);
    }, 500);
  };

  evSource.onopen = () => {
    if(reload) {
      evSource?.close();
      window.location.reload();
    }
  };
}
