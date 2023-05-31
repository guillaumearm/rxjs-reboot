import { Observable } from '../Observable';
import { OperatorFunction } from './types';

export function scan<T, R>(accumulator: (acc: R, value: T) => R, seed: R): OperatorFunction<T, R> {
  void Observable;
  void accumulator, seed;
  throw new Error('TODO');
}
