import type { Context } from 'oak';
import { ServerOptions } from '../models/server-options.ts';
import { buildHomeView } from '../views/home.ts';
import { createMiddleware } from './_models.ts';

type ViewBuilder = (ctx: Context, opt: ServerOptions) => string;

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
