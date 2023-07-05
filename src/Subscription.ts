import { Unsubscribable } from 'rxjs/internal/types';

/**
 * Typings
 */
type Teardown = () => void;
export interface ISubscription {
  readonly closed?: boolean;
  unsubscribe: Teardown;
  add: (t: TeardownLogic) => void;
  remove: (s: TeardownLogic) => void;
}

export interface SubscriptionConstructor {
  new (t?: Teardown): Subscription;
}

export type TeardownLogic = Subscription | Unsubscribable | Teardown | void;

/**
 * Implementation
 */

export class Subscription implements ISubscription {
  public closed = false;

  public constructor(action?: Teardown) {
    void action;
    throw new Error('TODO');
  }

  public unsubscribe(): void {
    throw new Error('TODO');
  }

  public add(tl: TeardownLogic): void {
    void tl;
    throw new Error('TODO');
  }

  public remove(tl: TeardownLogic): void {
    void tl;
    throw new Error('TODO');
  }
}
