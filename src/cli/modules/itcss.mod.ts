import { Dinovel } from 'dinovel/engine/dinovel.ts';
import { ensureDir } from 'deno/fs/mod.ts';

export async function InitItCss(folder: string, reset: boolean): Promise<number> {

  const folderList = [
    '1-settings',
    '2-tools',
    '3-elements',
    '4-components',
    '5-views',
    '6-utils',
  ];

  // Remove all files and folders if reset is true
  if (reset) {
    Dinovel.logger.warning('Reseting ItCss folder to default');
    await Deno.remove(folder, { recursive: true });
  }

  try {
    Dinovel.logger.info(`Initializing ItCss in ${folder}`);

    // Create all folders
    await ensureDir(folder);
    for (const folderName of folderList) {
      await ensureDir(`${folder}/${folderName}`);

      // Create __main.scss
      const mainFilePath = `${folder}/${folderName}/__main.scss`;
      try { await Deno.readFile(mainFilePath); }
      catch { await Deno.writeTextFile(mainFilePath, ''); }
      await addImport(folder, folderName);
    }

    Dinovel.logger.info(`ItCss initialized in ${folder}`);
  } catch (error) {
    Dinovel.logger.error(error);
    return 1;
  }

  return 0;
}

async function addImport(path: string, folder: string) {
  const importCall = `@import './${folder}/_main';`;
  const mainContent = await readMainFile(path);

  if (mainContent.includes(importCall)) { return; }

  await writeMainFile(path, `${mainContent}\n${importCall}`);
}

async function readMainFile(path: string) {
  try { return await Deno.readTextFile(`${path}/main.scss`); }
  catch { return ''; }
}

async function writeMainFile(path: string, content: string) {
  await Deno.writeTextFile(`${path}/main.scss`, content);
}
