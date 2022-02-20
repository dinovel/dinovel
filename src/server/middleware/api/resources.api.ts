import { Router } from 'oak';
import { readResources } from '../../modules/resources/__.ts';

export const resourcesRouter = new Router({ prefix: '/resources' });

resourcesRouter.get('/', async ctx => {
  const resources = await readResources();
  ctx.response.body = resources;
  ctx.response.type = 'text/json';
});
