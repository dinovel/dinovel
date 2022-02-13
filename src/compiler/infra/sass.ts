import { runSubprocess } from './subprocess.ts';

export interface SassOptions {
  input: string;
  output: string;
  compress: boolean;
  sourceMap: boolean;
}

export interface SassResult {
  success: boolean;
  message: string;
  output: string;
}

export async function compileSass(options: SassOptions, cwd?: string): Promise<SassResult> {
  const { input, output, compress, sourceMap } = options;

  const args = ['sass', input, output];
  args.push(`--style=${compress ? 'compressed' : 'expanded'}`);
  args.push(`--${sourceMap ? '': 'no-'}source-map`);

  const { success, stderr, stdout } = await runSubprocess({
    workingDirectory: cwd ?? Deno.cwd(),
    environment: {},
    args,
  });

  const message = success ? 'Sass compiled successfully' : stderr;
  return {
    success,
    message,
    output: stdout,
  }
}
