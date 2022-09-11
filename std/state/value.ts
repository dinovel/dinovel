import { Observable } from "rxjs";

export class StoreValue<T> {
  #getValue: () => T;
  #setValue: (value: T) => void;
  #observable: Observable<T>;

  constructor(
    getValue: () => T,
    setValue: (value: T) => void,
    obs: Observable<T>,
  ) {
    this.#getValue = getValue;
    this.#setValue = setValue;
    this.#observable = obs;
  }

  get value(): T {
    return this.#getValue();
  }

  set value(value: T) {
    this.#setValue(value);
  }

  get listen(): Observable<T> {
    return this.#observable;
  }

  get hasValue(): boolean {
    return this.#getValue() !== undefined;
  }

  init(value: T): void {
    if (this.hasValue) return;
    this.#setValue(value);
  }
}
