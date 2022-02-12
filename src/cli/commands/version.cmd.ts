import { CliCommand } from '../models.ts';
import { printVersion } from '../modules/version.mod.ts';

export const VersionCommand: CliCommand = {
  name: 'version',
  description: 'Prints the version of deno-novel and the versions of deno, typescript, and v8.',
  args: [],
  options: [],
  action: (_, __) => printVersion()
};
