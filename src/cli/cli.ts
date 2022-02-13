import {
  Args,
  parse,
} from 'deno/flags/mod.ts';

import { commandMap } from './commands/_.ts';
import { HelpCommand } from './commands/helper.cmd.ts';
import { logger } from './logger.ts';
import { initDinovel } from './init/init.ts';

import type { CliCommand } from "./models.ts";
const cmdList = [...commandMap.values(), HelpCommand];
const args = parse(Deno.args);

async function runCommand(cmd: CliCommand, args: (string | number)[], options: Args) {
  try {
    const result = await cmd.action(args, options);
    Deno.exit(result);
  } catch (e) {
    logger.error(e);
    Deno.exit(1);
  }
}

const commandName = args._[0];
const cmd = cmdList.find(e => e.name === commandName);

if (!commandName) {
  await runCommand(HelpCommand, [], args);
} else if (cmd) {
  await initDinovel();
  await runCommand(cmd, args._.slice(1), args);
} else {
  logger.error(`Command ${commandName} not found`);
  await runCommand(HelpCommand, [], args);
}
