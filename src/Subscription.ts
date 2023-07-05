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

const noop = () => {};

const executeTeardownLogic = (tl: TeardownLogic): void => {
  if (typeof tl === 'function') {
    tl();
    return;
  }

  if (tl) {
    tl.unsubscribe();
  }
};

/**
 * Implementation
 */

export class Subscription implements ISubscription {
  private teardowns: TeardownLogic[] = [];
  public closed = false;

  public constructor(private action: Teardown = noop) {}

  public unsubscribe(): void {
    if (this.closed) return;

    this.closed = true;

    executeTeardownLogic(this.action);
    this.teardowns.forEach(executeTeardownLogic);
  }

  public add(tl: TeardownLogic): void {
    if (this.closed) {
      executeTeardownLogic(tl);
    } else {
      this.teardowns.push(tl);
    }
  }

  public remove(tl: TeardownLogic): void {
    this.teardowns = this.teardowns.filter(t => t !== tl);
  }
}
