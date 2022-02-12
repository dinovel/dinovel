import { CliCommand } from '../models.ts';
import { VersionCommand } from './version.cmd.ts';

export const commandMap: CliCommand[] = [
  VersionCommand,
];
