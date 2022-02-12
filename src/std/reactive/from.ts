import type { IObservable } from "./models.ts";
import { ReplaySubject } from './replay-subject.ts';
import { Subject } from './subject.ts';

export function fromInterable<T>(interable: Iterable<T>): IObservable<T> {
  return new ReplaySubject(...Array.from(interable));
}

export function fromPromise<T>(promise: Promise<T>): IObservable<T> {
  const obs = new Subject<T>();

  promise.then(
    (value) => {
      obs.next(value);
      obs.complete();
    },
    (error) => {
      obs.error(error);
    }
  );

  return obs;
}
