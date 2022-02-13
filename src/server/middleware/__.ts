import {
  Application,
  Router,
} from 'oak';

import type { DevServerConfig } from 'dinovel/std/core/config.ts';
import { Middleware } from './_models.ts';
import { useSSE } from './events.ts';
import { useStaticFiles } from './static.ts';
import { useViews } from './views.ts';

const MIDDLEWARE: Middleware[] = [
  useSSE,
  useViews,
  useStaticFiles,
];

export function registerMiddleware(app: Application, options: DevServerConfig): void {
  const router = new Router();

  MIDDLEWARE.forEach(middleware => {
    middleware(app, router, options);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
