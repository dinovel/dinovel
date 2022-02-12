import type { IObservable, IPipeable } from "./models.ts";
import { Subject } from './subject.ts';

/** Wait specified amount of miliseconds before emiting a value */
export function debounce<T>(wait: number): IPipeable<T, T> {
  return (observable: IObservable<T>): IObservable<T> => {
    const obs = new Subject<T>();

    let timeout: number | undefined;

    observable.subscribe({
      next: (value) => {
        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
          obs.next(value);
        }, wait);
      },
      error: (error) => {
        obs.error(error);
      },
      complete: () => {
        if (timeout) {
          clearTimeout(timeout);
        }

        obs.complete();
      }
    });

    return obs;
  };
}

/** Map values from observable */
export function map<T, U>(mapper: (value: T) => U): IPipeable<T, U> {
  return (observable: IObservable<T>): IObservable<U> => {
    const obs = new Subject<U>();

    observable.subscribe({
      next: (value) => {
        obs.next(mapper(value));
      },
      error: (error) => {
        obs.error(error);
      },
      complete: () => {
        obs.complete();
      }
    });

    return obs;
  };
}

/** Return only new values */
export function distinctUntilChanged<T>(comparer: (a?: T, b?: T) => boolean): IPipeable<T, T> {
  return (observable: IObservable<T>): IObservable<T> => {
    const obs = new Subject<T>();

    let lastValue: T | undefined;

    observable.subscribe({
      next: (value) => {
        if (!comparer(lastValue, value)) {
          obs.next(value);
        }

        lastValue = value;
      },
      error: (error) => {
        obs.error(error);
      },
      complete: () => {
        obs.complete();
      }
    });

    return obs;
  };
}

/** Map result and return only new values */
export function select<T, U>(selector: (value: T) => U, comparer?: (a?: U, b?: U) => boolean): IPipeable<T, U> {
  return (observable: IObservable<T>): IObservable<U> => {
    const obs = new Subject<U>();

    let lastValue: U | undefined;

    observable.subscribe({
      next: (value) => {
        const nextValue = selector(value);
        const isNew = comparer ? !comparer(lastValue, nextValue) : lastValue !== nextValue;

        if (isNew) { obs.next(nextValue); }
      },
      error: (error) => {
        obs.error(error);
      },
      complete: () => {
        obs.complete();
      }
    });

    return obs;
  };
}
