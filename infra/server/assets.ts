import { Application, send } from 'oak';

export function registerAssets(app: Application, assetsFolder: string) {
  app.use(async (ctx, next) => {
    if (ctx.request.url.pathname.startsWith('/assets/')) {
      const path = ctx.request.url.pathname.replace('/assets/', '');
      await send(ctx, path, {
        root: assetsFolder,
      });
    }

    await next();
  });
}
