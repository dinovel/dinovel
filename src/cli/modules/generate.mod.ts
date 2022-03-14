import { Dinovel } from 'dinovel/engine/dinovel.ts';

export async function generate(template: string, output?: string, attr: Record<string, string> = {}, force = false) : Promise<number> {
  const templatePath = `${Dinovel.runtime.version.rootPath}/templates/${template}.tts`;
  let content = '';
  try { content = await Deno.readTextFile(templatePath); }
  catch {
    Dinovel.logger.error(`Template ${template} not found`);
    return 1;
  }

  const name = attr.name ?? 'new-component';

  if (!output) { output = `${Deno.cwd()}`; }

  if (output.split('.').pop() !== 'ts') {
    output += `/${name}.ts`;
  }

  for (const [key, value] of Object.entries(attr)) {
    content = content.replaceAll(`__${key}__`, value);
  }

  if (!force) {
    try {
      await Deno.stat(output);
      Dinovel.logger.error(`File ${output} already exists`);
      return 1;
    } catch { /* ignore */}
  }

  await Deno.writeTextFile(output, content);

  return 0;
}
