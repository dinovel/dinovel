export const DEFAULT_ENDPOINT = '/__livereload';

export interface LiveReloadOptions {
  endpoint: string;
  reloadEvent: string;
  enableLogging: boolean;
}

export interface Message {
  type: string;
}

export function buildLiveReloadOptions(opt?: Partial<LiveReloadOptions>): LiveReloadOptions {
  return {
    endpoint: DEFAULT_ENDPOINT,
    reloadEvent: 'reload',
    enableLogging: true,
    ...opt,
  };
}
