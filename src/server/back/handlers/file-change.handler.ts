import { resolve } from 'deno/path/mod.ts';

import { serverEvents } from '../infra/events.ts';
import {
  compileSass,
  SassOptions,
} from '../infra/sass.ts';
import {
  compileTypescript,
  TypescriptOptions,
} from '../infra/tsc.ts';
import { ServerOptions } from '../models/server-options.ts';

export async function fileChanged(opt: ServerOptions, paths: string[]): Promise<void> {
  const hasSassChanges = paths.some(path => path.endsWith('.scss'));
  const hasTsChanges = paths.some(path => path.endsWith('.ts'));

  if (hasTsChanges) { await compileScriptFiles(opt); }
  if (hasSassChanges) { await compileStyles(opt); }

  if (hasTsChanges) { serverEvents.emit('publicEvent', 'scriptLoaded'); }
  else if (hasSassChanges) { serverEvents.emit('publicEvent', 'cssLoaded'); }
}

async function compileScriptFiles(opt: ServerOptions): Promise<void> {
  const tsOptions: TypescriptOptions = {
    input: '',
    output: '',
    config: opt.denoConfig,
    importMap: opt.importMap,
    unstable: true,
  };

  serverEvents.emit('processing', 'starting');
  for (const [target, source] of Object.entries(opt.sources)) {
    tsOptions.input = source;
    tsOptions.output = resolve(opt.outDir, target + '.js');
    const res = await compileTypescript(tsOptions);
    if (!res.success) { serverEvents.emit('processError', [res.message, res.output]); }
    else { serverEvents.emit('processSuccess', [res.message, res.output]); }
  }
  serverEvents.emit('processing', 'done');
}

async function compileStyles(opt: ServerOptions): Promise<void> {
  const sassOptions: SassOptions = {
    compress: false,
    input: '',
    output: '',
    sourceMap: true,
  };

  serverEvents.emit('processing', 'starting');
  for (const [target, source] of Object.entries(opt.styles)) {
    sassOptions.input = source;
    sassOptions.output = resolve(opt.outDir, target + '.css');
    const res = await compileSass(sassOptions);
    if (!res.success) { serverEvents.emit('processError', [res.message, res.output]); }
    else { serverEvents.emit('processSuccess', [res.message, res.output]); }
  }
  serverEvents.emit('processing', 'done');
}
