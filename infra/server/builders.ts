import type { Router } from 'oak';
import { ServerOptions } from './options.ts';
import { BuildTarget, BuildTargets, DinovelBuilder } from '../build/mod.ts';
import { css, js, title, TemplateBuilder, defaultHeader, root } from '../template/mod.ts';
import type { LoggerService } from 'dinovel/std/logger.ts';

export function registerDinovelBuilder(router: Router, targets: BuildTargets, logger: LoggerService) {
  const builder = new DinovelBuilder(logger);
  builder.addTargets(targets);

  for (const [name, target] of Object.entries(targets)) {
    const path = buildPath(name, target);
    const contentType = target.type === 'script' ? 'application/javascript' : 'text/css';

    router.get(path, ctx => {
      const body = builder.getOutput(name);

      if (body) {
        ctx.response.body = body;
        ctx.response.headers.set('Content-Type', contentType);
      } else {
        ctx.response.status = 404;
      }
    });
  }

  return builder;
}

export function registerIndex(
  router: Router,
  options: ServerOptions,
) {

  const { transformers = [], templateOptions = {}, targets } = options;

  transformers.push(title(options.title ?? 'Dinovel'));
  transformers.push(defaultHeader());

  const entries = Object.entries(targets);
  const scripts = entries.filter(([_, target]) => target.type === 'script').map(([a]) => a);
  const styles = entries.filter(([_, target]) => target.type === 'style').map(([a]) => a);

  transformers.push(css(styles));
  transformers.push(js(scripts));
  transformers.push(root());

  const homeContent = TemplateBuilder.create()
    .setOptions(templateOptions)
    .apply(...transformers)
    .build();

  router.get('/', ctx => {
    ctx.response.body = homeContent;
    ctx.response.headers.set('Content-Type', 'text/html');
  });

}

function buildPath(name: string, target: BuildTarget) {
  const ext = target.type === 'script' ? 'mjs' : 'css';
  return `/${name}.${ext}`;
}
