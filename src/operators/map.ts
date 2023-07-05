import { Observable } from '../Observable';
import { OperatorFunction } from './types';

export function map<T, R>(project: (value: T) => R): OperatorFunction<T, R> {
  return source => {
    return new Observable(observer => {
      const next = (value: T) => {
        try {
          const result = project(value);
          observer.next(result);
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
