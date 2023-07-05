import { Observable } from '../Observable';
import { Subscription } from '../Subscription';
import { OperatorFunction } from './types';

export function switchMap<T, R>(project: (value: T) => Observable<R>): OperatorFunction<T, R> {
  return source => {
    return new Observable(obs => {
      let sourceIsCompleted = false;
      let innerSubscription = new Subscription();

      const innerNext = (resultValue: R) => {
        obs.next(resultValue);
      };

      const innerError = (err: unknown) => {
        obs.error(err);
      };

      const innerComplete = () => {
        if (sourceIsCompleted) {
          obs.complete();
        }
      };

      const next = (value: T) => {
        innerSubscription.unsubscribe();
        try {
          innerSubscription = project(value).subscribe({
            next: innerNext,
            error: innerError,
            complete: innerComplete,
          });
        } catch (e) {
          obs.error(e);
        }
      };

      const error = (err: unknown) => {
        obs.error(err);
      };

      const complete = () => {
        sourceIsCompleted = true;

        if (innerSubscription.closed) {
          obs.complete();
        }
      };

      const mainSub = source.subscribe({
        next,
        error,
        complete,
      });

      return () => {
        mainSub.unsubscribe();
        innerSubscription.unsubscribe();
      };
    });
  };
}
