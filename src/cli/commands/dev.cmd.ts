import { CliCommand } from '../models.ts';
import { startDevServer } from '../modules/dev-server.mod.ts';

export const DevCommand: CliCommand = {
  name: 'dev',
  description: 'Start the development server',
  args: [],
  options: [],
  action: () => startDevServer(),
};
