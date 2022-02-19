import { CliArgument, CliCommand, getOptionValue, CliOption } from '../models.ts';
import { InitItCss } from '../modules/itcss.mod.ts';

export const folderArg: CliArgument = {
  name: 'styles folder',
  description: 'Folder to create ITCss files',
  required: false,
};

export const resetOption: CliOption<boolean> = {
  name: 'reset',
  description: 'Reset the folder to default',
  hasValue: false,
  required: false,
  defaultValue: false,
  shortName: 'r',
};

export const ItCssCommand: CliCommand = {
  name: 'itcss',
  description: 'Initialize ItCss in a folder',
  args: [folderArg],
  options: [resetOption],
  action: (args, opts) => {
    const folderArgument = args[0];
    const folderPath = typeof folderArgument === 'string' ? folderArgument : '.';
    const reset = getOptionValue(opts, resetOption, false);
    return InitItCss(folderPath, reset);
  }
};
