import type { Application, Router } from 'oak';

export interface Server {
  app: Application;
  router: Router;
}

export interface ServerOptions {
  port: number;
  devMode: boolean;
  entry: string;
  style: string;
  root: string;
  assets: string;
  importMapURL?: URL;
}
