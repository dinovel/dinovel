import { createMiddleware } from './_models.ts';

export const useStaticFiles = createMiddleware((app, _, opt) => {
  app.use(async (ctx, next) => {
    const path = ctx.request.url.pathname;

    if (path.startsWith('/static/')) {
      const fullPath = path.replace('/static/', '');
      await ctx.send({
        root: opt.static,
        path: fullPath,
      });
    } else if (path.startsWith('/assets/')) {
      const fullPath = path.replace('/assets/', '');
      await ctx.send({
        root: opt.assets,
        path: fullPath,
      });
    } else {
      await next();
    }
  });
});
