import { IObservable } from './Observable';
import { Observer } from './Observer';
import { Subscriber } from './Subscriber';
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
  private closed = false;
  private closedByError = false;
  private lastError: unknown | undefined;

  private subscribers: Subscriber<T>[] = [];

  public constructor() {}

  private isClosed(): boolean {
    return this.closed || this.closedByError;
  }

  public next(value: T): void {
    if (this.isClosed()) return;
    this.subscribers.forEach(s => s.next(value));
  }

  public error(err: unknown): void {
    if (this.isClosed()) return;
    this.closedByError = true;
    this.lastError = err;
    this.subscribers.forEach(s => s.error(err));
  }

  public complete(): void {
    if (this.isClosed()) return;
    this.closed = true;
    this.subscribers.forEach(s => s.complete());
  }

  public subscribe(obs: Partial<Observer<T>>): Subscription {
    const subscriber = new Subscriber(obs);

    if (this.closed) {
      subscriber.complete();
    } else if (this.closedByError) {
      subscriber.error(this.lastError);
    } else {
      this.subscribers.push(subscriber);
    }

    return subscriber;
  }
}
