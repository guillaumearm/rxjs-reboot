import { Observable } from '../Observable';

export type OperatorFunction<T, R> = (observable: Observable<T>) => Observable<R>;
