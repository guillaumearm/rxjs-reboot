import { Observable } from '../Observable';
import { Subscription } from '../Subscription';
import { OperatorFunction } from './types';

export function retry<T>(limit?: number): OperatorFunction<T, T> {
  return source => {
    return new Observable(observer => {
      let count: number | undefined = limit;
      let sub: Subscription = new Subscription();

      const makeSubscription = (onError: (err: unknown) => void) => {
        sub = source.subscribe({
          next: value => observer.next(value),
          error: onError,
          complete: () => observer.complete(),
        });
      };

      const error = (err: unknown) => {
        if (count === undefined) {
          makeSubscription(error);
        } else if (count > 0) {
          count = count - 1;
          makeSubscription(error);
        } else {
          observer.error(err);
        }
      };

      makeSubscription(error);

      return () => {
        sub.unsubscribe();
      };
    });
  };
}
