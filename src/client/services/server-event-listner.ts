import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { PUBLIC_EVENT_NAME } from 'dinovel/server/shared/events.ts';

export function startServerEventListner(reload = false) {
  const evSource = new EventSource('/sse');

  evSource.addEventListener(PUBLIC_EVENT_NAME, e => {
    // deno-lint-ignore no-explicit-any
    const event = (e as any).data;
    Dinovel.events.emit(event);
  });

  evSource.onerror = () => {
    console.warn('EventSource error, trying to reconnect...');
    evSource?.close();

    setTimeout(() => {
      startServerEventListner(true);
    }, 500);
  };

  evSource.onopen = () => {
    if(reload) {
      evSource?.close();
      window.location.reload();
    }
  };
}
