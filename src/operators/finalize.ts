import { Observable } from '../Observable';
import { OperatorFunction } from './types';

export function finalize<T>(callback: () => void): OperatorFunction<T, T> {
  void Observable;
  void callback;
  throw new Error('TODO');
}
