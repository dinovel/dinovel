import ReactDOM from 'react-dom/client';
import React from 'react';
import { DinovelCore, initHandler, DinovelEvents, Plugin } from 'dinovel/engine/mod.ts';
import { EventsHandler } from "dinovel/std/events.ts";
import { Store } from 'dinovel/std/state.ts';
import { Unit } from 'dinovel/std/helpers.ts';
import { MainMenu } from 'dinovel/widgets/views/main-menu.tsx';

import { ClientOptions } from "./client-options.ts";
import { getPlugins } from "./plugins/__.ts";

/**
 * Start dinovel game engine
 *
 * @param opt Startup options
 * @param userPlugins Plugins to load
 * @param defaults Load defaults from the server
 */
export async function startDinovel(
  opt: ClientOptions,
  userPlugins: Plugin[] = [],
  defaults = true,
) {
  const id = opt.elemId || "app";
  const rootElem = document.getElementById(id);
  if (!rootElem) { throw new Error(`No element with id ${id}`); }

  const plugins = getPlugins(defaults, userPlugins);
  const appRoot = ReactDOM.createRoot(rootElem);

  const core: DinovelCore = {
    events: new EventsHandler<DinovelEvents>(),
    store: new Store<Unit>({}),
    engine: {
      type: 'client',
      running: true,
      title: opt.title,
      version: '0.0.0',
      app: appRoot,
    }
  }


  for (const plugin of plugins) {
    await plugin.inject?.call(plugin, core);
  }

  initHandler.init(core);
  appRoot.render(opt.root ?? <MainMenu title={opt.title} />);

  for (const plugin of plugins) {
    await plugin.start?.call(plugin, core);
  }

  globalThis.window.onclose = async () => {
    for (const plugin of plugins) {
      await plugin.stop?.call(plugin, core);
    }
  }
}
