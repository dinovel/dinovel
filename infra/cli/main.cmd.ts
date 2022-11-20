import { Command } from "cliffy/command/mod.ts";
import { version } from './version.ts';

export type GlobaOptions = {
  config: string;
}

export const mainCommand = new Command()
  .name("dinovel")
  .version(version)
  .globalOption("-c, --config <config:file>", "Configuration file", { default: "./.dn.json" })
  .description("Dinovel CLI");
