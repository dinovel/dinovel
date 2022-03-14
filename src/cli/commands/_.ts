import { CliCommand } from '../models.ts';
import { VersionCommand } from './version.cmd.ts';
import { ItCssCommand } from './itcss.cmd.ts';
import { DevCommand } from "./dev.cmd.ts";
import { GenerateCommand } from "./generate.cmd.ts";

export const commandMap: CliCommand[] = [
  VersionCommand,
  ItCssCommand,
  DevCommand,
  GenerateCommand,
];
