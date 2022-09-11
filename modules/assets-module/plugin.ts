import type { Plugin, DinovelCore, Server } from 'dinovel/engine/mod.ts';
import { logger } from 'dinovel/std/logger.ts';
import { send } from 'oak';

import { getAsset, ASSETS_PREFIX, ASSET_BY_ID_PREFIX, setAssetsMap } from './loader.ts';
import type { AssetsMap } from './models.ts';

export class ServeAssetsByIdPlugin implements Plugin {
  name = 'serve-assets-by-id';
  #location: string;

  public constructor(map?: AssetsMap, location?: string) {
    this.#location = location ?? `${Deno.cwd()}/assets/`;
    if (map) { setAssetsMap(map); }
  }

  inject(core: DinovelCore): void {
    const server = core.engine as Server;

    server.router.get(`${ASSET_BY_ID_PREFIX}:id`, async ctx=> {
      const id = ctx.params.id;
      if (!id) {
        logger.warning(`[${ASSET_BY_ID_PREFIX}:id] No asset id provided`);
        ctx.response.body = 'No asset id provided';
        ctx.response.status = 400;
        return;
      }

      const asset = getAsset(id);
      if (!asset) {
        logger.warning(`[${ASSET_BY_ID_PREFIX}:id] No asset found with id:`, id);
        ctx.response.body = 'No asset found for id: ' + id;
        ctx.response.status = 404;
        return;
      }

      const path = asset.path.replace(ASSETS_PREFIX + '/', '');

      await send(ctx, path, {
        root: this.#location,
      });
    });
  }
}
