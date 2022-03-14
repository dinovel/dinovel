import { CliCommand, CliOption, getOptionValue } from '../models.ts';
import { Args } from 'deno/flags/mod.ts';
import { generate } from '../modules/generate.mod.ts';

const outputOption: CliOption<string> = {
  name: 'output',
  description: 'Output file or directory',
  hasValue: true,
  required: false,
  defaultValue: '',
  shortName: 'o',
};

const forceOption: CliOption<boolean> = {
  name: 'force',
  description: 'Force overwrite',
  hasValue: false,
  required: false,
  defaultValue: false,
  shortName: 'f',
};

const attrOptions: CliOption<string> = {
  name: 'a-[key]',
  description: 'Attribute to replace',
  hasValue: true,
  required: false,
  defaultValue: '',
}

const tempalteOption: CliOption<string> = {
  name: 'template',
  description: 'Template to use',
  hasValue: true,
  required: true,
  shortName: 't',
};

export const GenerateCommand: CliCommand = {
  name: 'generate',
  description: 'Generate a new file using a template',
  args: [],
  options: [
    outputOption,
    forceOption,
    attrOptions,
    tempalteOption,
  ],
  action: (_, opts) => {
    const attrs = readAttr(opts);
    const template = getOptionValue(opts, tempalteOption, '');
    const output = getOptionValue(opts, outputOption, '');
    const force = getOptionValue(opts, forceOption, false);
    return generate(template, output, attrs, force);
  }
};

function readAttr(opts: Args): Record<string, string> {
  const attr: Record<string, string> = {};

  for (const [key, value] of Object.entries(opts)) {
    if (key.startsWith('a-')) {
      attr[key.substring(2)] = value;
    }
  }

  return attr;
}

