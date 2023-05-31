/**
 * Typings
 */

import { Observer } from './Observer';
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
  constructor(subscriptionFactory: SubscriptionFactory<T>) {
    void subscriptionFactory;
    throw new Error('TODO');
  }

  subscribe(obs: Partial<Observer<T>>): Subscription {
    void obs;
    throw new Error('TODO');
  }
}
