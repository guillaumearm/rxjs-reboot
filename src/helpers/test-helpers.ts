import * as Rx from 'rxjs';
import { Observable } from '../Observable';
import { Subject } from '../Subject';

/**
 * Mocks
 */
export const dummyObservable$ = new Rx.Observable<number>(obs => {
  obs.next(1);
  obs.next(2);
  obs.next(4);
  obs.complete();
}) as unknown as Observable<number>;

export const dummyErrorObservable$ = new Rx.Observable<number>(obs => {
  obs.error('test');
}) as unknown as Observable<number>;

/**
 * Additional helpers (for unit tests)
 */
export const of = <T>(value: T): Observable<T> => Rx.of(value) as unknown as Observable<T>;

export const createSubject = <T>(): Subject<T> => {
  return new Rx.Subject<T>() as unknown as Subject<T>;
};

export const toObservable = <T>(s: Subject<T>): Observable<T> => {
  return s as unknown as Observable<T>;
};
