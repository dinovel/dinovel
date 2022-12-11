import version from '../version.ts';
import { join, parse } from 'deno/path/mod.ts';

type Bump = 'patch' | 'minor' | 'major';

interface InputArgs {
  bump: Bump;
  github: boolean;
}

function parseArgs(): InputArgs {
  return {
    bump: Deno.args[0] as Bump,
    github: !!Deno.args.find((e) => e === '--github'),
  };
}

function calcNextVersion(input: InputArgs): string {
  const parts = version.split('.').map((part) => parseInt(part, 10));

  switch (input.bump) {
    case 'patch':
      parts[2] += 1;
      break;
    case 'minor':
      parts[1] += 1;
      parts[2] = 0;
      break;
    case 'major':
      parts[0] += 1;
      parts[1] = 0;
      parts[2] = 0;
      break;
    default:
      throw new Error(`Invalid bump type: ${input.bump}`);
  }

  return parts.join('.');
}

async function updateVersionInFile(nextVersion: string) {
  const thisRoot = parse(Deno.mainModule).dir.replace('file:', '');
  const target = join(thisRoot, '..', 'version.ts');
  await Deno.writeTextFile(target, `export default '${nextVersion}';`);
}

async function writeStdout(stream: WritableStream<Uint8Array>, input: InputArgs, message: string, varName?: string) {
  const m = typeof varName === 'string' && input.github ? `${varName}=${message}\n` : message;
  const toWrite = new TextEncoder().encode(m);
  await stream.getWriter().write(toWrite);
}
const input = parseArgs();
try {
  const nextVersion = calcNextVersion(input);
  await updateVersionInFile(nextVersion);
  await writeStdout(Deno.stdout.writable, input, nextVersion, 'VERSION');
  await writeStdout(Deno.stderr.writable, input, 'true', 'SUCCESS');
} catch (err) {
  await writeStdout(Deno.stderr.writable, input, 'false', 'SUCCESS');
  throw err;
}
