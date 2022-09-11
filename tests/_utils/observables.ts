import { Observable } from "rxjs";

export interface Listner<T> {
  completed: boolean;
  calls: number;
  data: T[];
  error?: Error;
  promise: Promise<T>;
}

export function L<T>(obs: Observable<T>): Readonly<Listner<T>> {
  const listner = {
    completed: false,
    calls: 0,
    data: [] as T[],
    error: undefined,
    promise: new Promise<T>((resolve, reject) => {
      obs.subscribe({
        next: (data) => {
          listner.calls++;
          listner.data.push(data);
          resolve(data);
        },
        error: (error) => {
          listner.error = error;
          reject(error);
        },
        complete: () => {
          listner.completed = true;
        },
      });
    }
  )};
  return listner;
}
