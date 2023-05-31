import { Observable } from '../Observable';
import { OperatorFunction } from './types';

export function switchMap<T, R>(project: (value: T) => Observable<R>): OperatorFunction<T, R> {
  void project;
  throw new Error('TODO');
}
