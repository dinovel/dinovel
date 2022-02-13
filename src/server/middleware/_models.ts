import type {
  Application,
  Router,
} from 'oak';
import type { DevServerConfig } from 'dinovel/std/core/config.ts';

export type Middleware = (app: Application, router: Router, opt: DevServerConfig) => void;

export function createMiddleware(middleware: Middleware): Middleware {
  return middleware;
}
