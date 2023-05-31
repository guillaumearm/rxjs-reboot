import { IObservable } from './Observable';
import { Observer } from './Observer';
import { Subscription } from './Subscription';

/**
 * Typings
 */

export interface ISubject<T> extends IObservable<T>, Observer<T> {}

export interface SubjectConstructor {
  new <T>(): ISubject<T>;
}

/**
 * Implementation
 */
export class Subject<T> implements IObservable<T>, Observer<T> {
  public constructor() {}

  public next(value: T): void {
    void value;
    throw new Error('TODO');
  }

  public error(err: unknown): void {
    void err;
    throw new Error('TODO');
  }

  public complete(): void {
    throw new Error('TODO');
  }

  public subscribe(obs: Partial<Observer<T>>): Subscription {
    void obs;
    throw new Error('TODO');
  }
}
