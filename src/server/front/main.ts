import 'dinovel/widgets/__.ts';

import { registerGlobal } from 'dinovel/engine/dinovel.ts';
import { setRegistry } from 'dinovel/engine/internal/registry.ts';
import { globalRegistry } from 'dinovel/render';

import { startEventhandler } from './infra/event-handler.ts';
import { startEventListner } from './infra/event-listner.ts';

setRegistry(globalRegistry);
registerGlobal();
globalRegistry.init();

setTimeout(() => {
  startEventListner(false);
}, 500);

startEventhandler();
