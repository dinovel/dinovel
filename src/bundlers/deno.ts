import type { LoggerService } from "dinovel/std/logger.ts";

export interface DenoBundleFail {
  message: string;
  success: false;
}

export interface DenoBundleSuccess {
  success: true;
  bundle: string;
  warns?: string[];
}

export type DenoBundle = DenoBundleFail | DenoBundleSuccess;

export interface DenoBundler {
  /** kill watch mode */
  kill(): void;
  /** wait for process exit */
  status(): Promise<number>;
}

/** Configuration options for DenoBundler */
export interface DenoBundleConfig {
  /** Entry file */
  entry: string | URL;
  /** Working directory */
  cwd?: string;
  /** Import map path */
  importMap?: string | URL;
  /** Deno config file */
  denoConfig?: string;
  /** Don't load config file */
  skipConfig?: boolean;
  /** Reload cache */
  forceReload?: boolean | string;
  /** use unstable */
  unstable?: boolean;
  /** watch mode */
  watch?: boolean;
  /** Deno file path */
  deno?: string | URL;
}

export function bundle(config: DenoBundleConfig, callback: (e: DenoBundle) => void, logger?: LoggerService): DenoBundler {
  const [denoPath, args] = buildRunOptions(config);

  let killSignal = false;
  const isAlive = () => !killSignal;
  const kill = () => killSignal = true;
  const status = async () => {
    logger?.debug("Starting deno bundler for: " + getPath(config.entry));

    const p = Deno.run({
      cmd: [denoPath, ...args],
      cwd: config.cwd ?? Deno.cwd(),
      env: { NO_COLOR: "true" },
      stdout: "piped",
      stderr: "piped",
      stdin: "null"
    });

    let textBuffer = "";
    const onRead = (e: string | null) => {
      textBuffer += e ?? '';
      const [buffer, result] = parseData(textBuffer, !!config.watch, e === null);
      textBuffer = buffer;
      if (result) { callback(result); }
    }

    const outRead = read(p.stdout, onRead, isAlive);
    const errRead = read(p.stderr, onRead, isAlive);

    await Promise.all([outRead, errRead]);
    p.close();
    const s = await p.status();
    logger?.debug("Deno bundler exited with code: " + s.code);
    return s.code;
  };

  return { kill, status };
}

const END_MESSAGE = "Watcher Bundle finished. Restarting on file change...";
const START_CODE_SUCCESS = "// This code was bundled using `deno bundle` and it's not recommended to edit it manually";
const START_CODE_FAIL = "error";
const WARNING = /^Warning(.*)$/gm;

function buildRunOptions(config: DenoBundleConfig): [string, string[]] {
  const entry = getPath(config.entry);

  if(!entry) { throw new Error('entry file is required'); }

  const denoPath = getPath(config.deno) ?? Deno.execPath();
  const args = ["bundle"];

  const importMap = getPath(config.importMap);
  if(importMap) {
    args.push("--import-map", importMap);
  }

  if (config.skipConfig) {
    args.push("--no-config");
  }

  if (config.denoConfig) {
    args.push("--config", config.denoConfig);
  }

  if (config.forceReload) {
    if (typeof config.forceReload === "string") {
      args.push(`--reload=${config.forceReload}`);
    } else {
      args.push("--reload");
    }
  }

  if (config.unstable) {
    args.push("--unstable");
  }

  if (config.watch) {
    args.push("--watch", "--no-clear-screen");
  }

  args.push(entry);

  return [denoPath, args];
}

function getPath(file: string | URL | undefined): string | undefined {
  if (file === undefined) {
    return undefined;
  }
  if (file instanceof URL) {
    return file.href;
  }
  return file;
}

async function read(reader: Deno.Reader, onRead: (e: string | null) => void, isAlive: () => boolean): Promise<void> {
  const buffer = new Uint8Array(1024 * 6);
  while (isAlive()) {
    const size = await reader.read(buffer);
    if (size) {
      onRead(new TextDecoder().decode(buffer.subarray(0, size)));
    }
    if (size === null) {
      onRead(null);
      break;
    }
  }
}

function parseData(text: string, watch: boolean, eof: boolean): [string, DenoBundle | undefined] {
  if (!watch && eof) {
    return [text, { success: true, bundle: text }];
  } else if (!watch) {
    return [text, undefined];
  }

  const status: 'success' | 'fail' | 'unknown' =
    text.includes(START_CODE_SUCCESS) ? 'success'
    : text.includes(START_CODE_FAIL) ? 'fail'
    : 'unknown';

  if (status === 'unknown') { return [text, undefined]; }
  if (!text.includes(END_MESSAGE)) { return [text, undefined]; }

  let startIndex = status === 'success' ? text.lastIndexOf(START_CODE_SUCCESS) : text.indexOf(START_CODE_FAIL);
  startIndex = startIndex + (status === 'success' ? START_CODE_SUCCESS.length : START_CODE_FAIL.length);

  const endIndex = text.indexOf(END_MESSAGE);

  const code = text.substring(startIndex, endIndex);
  const result = text.substring(endIndex + END_MESSAGE.length);

  const warns: string[] = [];
  for (const match of text.matchAll(WARNING)) {
    warns.push(match[1]);
  }

  if (status === 'success') {
    return [result, { success: true, bundle: code, warns }];
  } else {
    return [result, { success: false, message: code }];
  }
}
