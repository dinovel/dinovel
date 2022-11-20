import { mainCommand } from './main.cmd.ts';

import { addServeCommand } from './serve.cmd.ts';

addServeCommand(mainCommand);

export * from './main.cmd.ts';
