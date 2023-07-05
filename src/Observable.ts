/**
 * Typings
 */

import { Observer } from './Observer';
import { Subscriber } from './Subscriber';
import { Subscription, TeardownLogic } from './Subscription';

type SubscribeFunction<T> = (obs: Partial<Observer<T>>) => Subscription;

type SubscriptionFactory<T> = (observer: Observer<T>) => TeardownLogic;

export interface IObservable<T> {
  subscribe: SubscribeFunction<T>;
}

export interface ObservableConstructor {
  new <T>(subscriptionFactory: SubscriptionFactory<T>): IObservable<T>;
}

/**
 * Implementation
 */
export class Observable<T> implements IObservable<T> {
  constructor(private subscriptionFactory: SubscriptionFactory<T>) {}

  subscribe(obs: Partial<Observer<T>>): Subscription {
    const subscriber = new Subscriber(obs);

    try {
      subscriber.add(this.subscriptionFactory(subscriber));
    } catch (e) {
      subscriber.error(e);
    }

    return subscriber;
  }
}
