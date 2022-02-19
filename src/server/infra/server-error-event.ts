// deno-lint-ignore-file no-explicit-any
export interface ServerErrorEvent {
  isTrusted: boolean;
  context?: {
    respond: boolean;
    request: any;
    response: any;
    state: any;
    matched: ({
      path: string;
      paramNames: string[];
    })[];
  }
}
