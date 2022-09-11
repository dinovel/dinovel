import { Subject, from, Observable } from "rxjs";
import type { DinovelCore } from "./core.ts";

/** Keep track of init status for dinovel engine */
export class DinovelInit {
  #core: DinovelCore | undefined;
  #hasInit = false;
  #ready = new Subject<DinovelCore>();

  constructor() {
    this.#core = undefined;
  }

  /** Get current engine, exception if not initialized */
  get core() {
    if (!this.#hasInit || !this.#core) {
      throw new Error('Dinovel has not been initialized');
    }

    return this.#core;
  }

  /** Get current init status */
  get hasInit() {
    return this.#hasInit;
  }

  /** Get init status observable */
  get onInit(): Observable<DinovelCore> {
    if (this.#hasInit && this.#core) {
      return from([this.#core]);
    }

    return this.#ready;
  }

  /** Init, exception if called multiple times */
  init(dinovel: DinovelCore) {
    if (this.#hasInit) {
      throw new Error('Dinovel has already been initialized');
    }

    this.#core = dinovel;
    this.#hasInit = true;
    this.#ready.next(dinovel);
  }
}
