import { Command } from "cliffy/command/mod.ts";

import type { GlobaOptions } from './main.cmd.ts';
import { loadDinovelConfig } from './config-loader.ts';

export function addServeCommand(main: Command<GlobaOptions>) {
  const serveCommand = new Command<GlobaOptions>()
    .description("Start the development server")
    .action(async opt => {
      const config = await loadDinovelConfig(opt.config);
      console.log(config);
    });

  main.command('serve', serveCommand);
}
