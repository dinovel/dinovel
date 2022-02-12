import { runSubprocess } from './subprocess.ts';

export interface TypescriptOptions {
  input: string;
  output: string;
  importMap?: string;
  unstable?: boolean;
  config?: string;
}

export interface TypescriptResult {
  success: boolean;
  message: string;
  output: string;
}

export async function compileTypescript(options: TypescriptOptions, cwd?: string): Promise<TypescriptResult> {
  const { input, output, importMap, unstable, config } = options;

  const args = ['deno', 'bundle'];
  if (importMap) { args.push('--import-map', importMap); }
  if (unstable) { args.push('--unstable'); }
  if (config) { args.push('--config', config); }
  args.push(input, output);

  const { success, stderr, stdout } = await runSubprocess({
    workingDirectory: cwd ?? Deno.cwd(),
    environment: {},
    args,
  });

  const message = success ? 'Typescript compiled successfully' : stderr;
  return {
    success,
    message,
    output: stdout,
  };
}
