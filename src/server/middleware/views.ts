import type { Context } from 'oak';
import type { DevServerConfig } from 'dinovel/std/core/config.ts';
import { buildHomeView } from '../views/home.ts';
import { createMiddleware } from './_models.ts';

type ViewBuilder = (ctx: Context, opt: DevServerConfig) => string;

const viewMap: { [key: string]: ViewBuilder } = {
  '/': buildHomeView,
};

export const useViews = createMiddleware((_, router, opt) => {
  for (const [path, builder] of Object.entries(viewMap)) {
    router.get(path, ctx => {
      ctx.response.body = builder(ctx, opt);
      ctx.response.type = "text/html";
    });
  }
});
