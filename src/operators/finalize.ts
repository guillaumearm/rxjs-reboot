import { Observable } from '../Observable';
import { OperatorFunction } from './types';

export function finalize<T>(callback: () => void): OperatorFunction<T, T> {
  return source => {
    return new Observable(observer => {
      let finalized = false;

      const finalizeFn = () => {
        if (!finalized) {
          finalized = true;
          callback();
        }
      };

      const complete = () => {
        observer.complete();
        finalizeFn();
      };

      const sub = source.subscribe({
        next: val => observer.next(val),
        error: err => observer.error(err),
        complete: () => complete(),
      });

      sub.add(finalizeFn);

      return sub;
    });
  };
}
