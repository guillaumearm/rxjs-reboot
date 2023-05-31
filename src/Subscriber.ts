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
export class Subscriber<T> extends Subscription implements Observer<T> {
  public constructor(obs: Partial<Observer<T>>) {
    super();

    void obs;
    throw new Error('TODO');
  }

  /* Observer implementation  */
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
}
