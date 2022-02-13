export interface RunOptions {
  workingDirectory: string;
  environment: { [key: string]: string };
  args: string[];
}

export interface RunResult {
  status: Deno.ProcessStatus;
  success: boolean;
  stdout: string;
  stderr: string;
}

/**
 * Run a command in a subprocess.
 *
 * @param options run options
 * @returns output of the command
 */
export async function runSubprocess(options: RunOptions): Promise<RunResult> {
  let { workingDirectory, environment, args } = options;

  if (Deno.build.os === 'windows') {
    args = ['pwsh', '-c', ...args];
  } else {
    args = ['bash', '-c', args.join(' ')];
  }

  const process = Deno.run({
    cmd: args,
    cwd: workingDirectory,
    env: environment,
    stderr: 'piped',
    stdout: 'piped',
  });

  const [stdout, stderr] = await Promise.all([
    process.output(),
    process.stderrOutput(),
  ]);

  const result: RunResult = {
    get success() { return this.status.success; },
    status: await process.status(),
    stdout: new TextDecoder().decode(stdout),
    stderr: new TextDecoder().decode(stderr),
  };

  return result;
}
