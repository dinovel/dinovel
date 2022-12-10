export interface TranspileMessage {
  file?: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  line?: number;
  column?: number;
}

export interface TranspileResultSuccess {
  output: string;
  diagnostics: TranspileMessage[];
  target: URL;
  success: true;
  extra?: unknown;
}

export interface TranspileResultFailure {
  diagnostics: TranspileMessage[];
  target: URL;
  success: false;
  extra?: unknown;
}

export type TranspileResult = TranspileResultSuccess | TranspileResultFailure;

export interface TranspileOptions {
  optimize: boolean;
  target: URL;
  useImportMap: boolean;
  importMapURL: URL;
}

export interface FileTranspiler {
  transpile(options: TranspileOptions): Promise<TranspileResult>;
}

export interface TranspileWatchOptions {
  paths: string[];
  extensions: string[];
}
