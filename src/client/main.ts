import { home } from './views/home.ts';
import { Render } from 'dinovel/render/render.ts';

class ClientRender extends Render {
  public constructor() {
    super(home);
  }
}

new ClientRender().mount();
