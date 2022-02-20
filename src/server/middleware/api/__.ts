import { Router } from 'oak';
import { resourcesRouter } from './resources.api.ts';

export const apiRouter = new Router({ prefix: '/api' });

const routers: Router[] = [
  resourcesRouter,
];

routers
  .forEach(router => apiRouter
    .use(
      router.routes(),
      router.allowedMethods()
    )
  );
