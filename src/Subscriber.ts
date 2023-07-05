import { Observer } from './Observer';
import { Subscription, ISubscription } from './Subscription';

/**
 * Typings
 */

export interface ISubscriber<T> extends ISubscription, Observer<T> {}

export interface SubscriberConstructor {
  new <T>(obs: Observer<T>): ISubscriber<T>;
}

/**
 * Implementation
 */

const noop = () => {};

export class Subscriber<T> extends Subscription implements Observer<T> {
  private observer: Observer<T>;

  public constructor(obs: Partial<Observer<T>>) {
    super();

    this.observer = {
      next: obs.next ?? noop,
      error: obs.error ?? noop,
      complete: obs.complete ?? noop,
    };
  }

  /* Observer implementation  */
  public next(value: T): void {
    if (this.closed) return;
    this.observer.next(value);
  }

  public error(err: unknown): void {
    if (this.closed) return;
    this.observer.error(err);
    this.unsubscribe();
  }

  public complete(): void {
    if (this.closed) return;
    this.observer.complete();
    this.unsubscribe();
  }
}
