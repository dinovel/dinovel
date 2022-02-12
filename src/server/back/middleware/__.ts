import {
  Application,
  Router,
} from 'oak';

import { ServerOptions } from '../models/server-options.ts';
import { Middleware } from './_models.ts';
import { useSSE } from './events.ts';
import { useStaticFiles } from './static.ts';
import { useViews } from './views.ts';

const MIDDLEWARE: Middleware[] = [
  useSSE,
  useViews,
  useStaticFiles,
];

export function registerMiddleware(app: Application, options: ServerOptions): void {
  const router = new Router();

  MIDDLEWARE.forEach(middleware => {
    middleware(app, router, options);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
