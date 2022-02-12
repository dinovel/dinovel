import type {
  Application,
  Router,
} from 'oak';
import type { ServerOptions } from '../models/server-options.ts';

export type Middleware = (app: Application, router: Router, opt: ServerOptions) => void;

export function createMiddleware(middleware: Middleware): Middleware {
  return middleware;
}
