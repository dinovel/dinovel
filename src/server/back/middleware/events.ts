import {
  ServerSentEvent,
  ServerSentEventTarget,
} from 'oak';

import { PUBLIC_EVENT_NAME } from '../../shared/events.ts';
import { serverEvents } from '../infra/events.ts';
import { createMiddleware } from './_models.ts';

const targets: ServerSentEventTarget[] = [];

export const useSSE = createMiddleware((_, router) => {
  router.get('/sse', ctx => {
    const target = ctx.sendEvents();
    targets.push(target);
    target.dispatchMessage('ok');
  });

  serverEvents.on('publicEvent', ev => {
    const event = new ServerSentEvent(PUBLIC_EVENT_NAME, ev);
    targets.forEach(target => {
      if (target.closed) { return; }
      target.dispatchEvent(event);
    });
  });
});
