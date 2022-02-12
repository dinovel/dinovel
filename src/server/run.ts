import { fileChanged } from './back/handlers/file-change.handler.ts';
import { serverEvents } from './back/infra/events.ts';
import { Server } from './back/server.ts';

const serverOptions = {
  port: 9091,
  front: './dist',
  importMap: './import_map.json',
  denoConfig: './deno.jsonc',
  outDir: './dist/libs',
  sources: { 'main': './src/front/main.ts' },
  styles: { 'styles': './src/front/styles.scss' },
  watch: ['./src/front'],
  logErrors: false,
};

const server = new Server(serverOptions);

console.log(`Server listening on port 9091`);

serverEvents.on('watching', paths => {
  console.log(`Watching directories:`);
  paths.forEach((path) => {
    console.log(`- ${path}`);
  });
});

serverEvents.on('fileChanged', paths => {
  console.log(`File changed:`);
  paths.forEach((path) => {
    console.log(`- ${path}`);
  });
});

serverEvents.on('processError', ([message, error]) => {
  console.error(message);
  if (error) console.error(error);
})

await fileChanged(serverOptions, ['.scss', '.ts']);
await server.start();
