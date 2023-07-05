import { Observable } from '../Observable';
import { OperatorFunction } from './types';

export function scan<T, R>(accumulator: (acc: R, value: T) => R, seed: R): OperatorFunction<T, R> {
  return source => {
    return new Observable(observer => {
      let acc: R = seed;

      const next = (value: T) => {
        try {
          acc = accumulator(acc, value);
          observer.next(acc);
        } catch (e) {
          observer.error(e);
        }
      };

      return source.subscribe({
        next,
        error: err => observer.error(err),
        complete: () => observer.complete(),
      });
    });
  };
}
