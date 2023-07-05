import 'jest-extended';
import * as Rx from 'rxjs';

import { SubscriptionConstructor, Subscription } from '../Subscription';

const testSubscription = (SubscriptionClass: SubscriptionConstructor) => () => {
  it('[constructor] should not throw when created', () => {
    expect(() => new SubscriptionClass()).not.toThrow();
  });

  it('[closed] should be false on creation', () => {
    expect(new SubscriptionClass().closed).toBe(false);
  });

  it('[closed] should be true after unsubscribe', () => {
    const sub = new SubscriptionClass();
    sub.unsubscribe();
    expect(sub.closed).toBe(true);
  });

  it('[unsubscribe] should call the given teardown', () => {
    const teardown = jest.fn();
    const sub = new SubscriptionClass(teardown);

    sub.unsubscribe();

    expect(teardown).toBeCalledTimes(1);
    expect(sub.closed).toBe(true);
  });

  it('[unsubscribe] should call the given teardonwn once', () => {
    const teardown = jest.fn();
    const sub = new SubscriptionClass(teardown);

    sub.unsubscribe();
    sub.unsubscribe();

    expect(teardown).toBeCalledTimes(1);
  });

  it('[add] should execute added teardowns when subscription is closed', () => {
    const initialTeardown = jest.fn();
    const additionalTeardown = jest.fn();

    const sub = new SubscriptionClass(initialTeardown);
    sub.add(additionalTeardown);

    sub.unsubscribe();

    expect(initialTeardown).toBeCalledTimes(1);
    expect(additionalTeardown).toBeCalledTimes(1);
  });

  it('[add] should be able to unsubscribe partially using child subscription', () => {
    const parentTeardown = jest.fn();
    const childTeardown = jest.fn();
    const childSub = new SubscriptionClass(childTeardown);

    const parentSub = new SubscriptionClass(parentTeardown);
    parentSub.add(childSub);

    childSub.unsubscribe();

    // childSub.unsubscribe();
    expect(childTeardown).toBeCalledTimes(1);
    expect(parentTeardown).not.toBeCalled();

    parentSub.unsubscribe();
    expect(childTeardown).toBeCalledTimes(1);
    expect(parentTeardown).toBeCalledTimes(1);
  });

  it('[add] should add several teardowns', () => {
    const teardownA = jest.fn();
    const teardownB = jest.fn();
    const teardownC = jest.fn();

    const sub = new SubscriptionClass();

    sub.add(teardownA);
    sub.add(teardownB);
    sub.add(teardownC);

    sub.unsubscribe();

    expect(teardownA).toBeCalledTimes(1);
    expect(teardownB).toBeCalledTimes(1);
    expect(teardownC).toBeCalledTimes(1);
  });

  it('[add] should call a child teardown twice', () => {
    const teardown = jest.fn();

    const subA = new SubscriptionClass();
    const subB = new SubscriptionClass();

    subA.add(teardown);
    subB.add(teardown);

    subA.unsubscribe();
    subB.unsubscribe();

    expect(teardown).toBeCalledTimes(2);
  });

  it('[add] should call a child subscription once', () => {
    const teardown = jest.fn();
    const teardownSub = new SubscriptionClass(teardown);

    const subA = new SubscriptionClass();
    const subB = new SubscriptionClass();

    subA.add(teardownSub);
    subB.add(teardownSub);

    subA.unsubscribe();
    subB.unsubscribe();

    expect(teardown).toBeCalledTimes(1);
  });

  it('[add] should call a new added teardown when already unsubscribed', () => {
    const initialTeardown = jest.fn();
    const sub = new SubscriptionClass(initialTeardown);

    sub.unsubscribe();
    expect(initialTeardown).toBeCalledTimes(1);

    const additionalTeardown = jest.fn();
    sub.add(additionalTeardown);
    expect(additionalTeardown).toBeCalledTimes(1);
  });

  it('[remove] should be able to remove a child subscription', () => {
    const parentTeardown = jest.fn();
    const childTeardown = jest.fn();
    const childSub = new SubscriptionClass(childTeardown);

    const parentSub = new SubscriptionClass(parentTeardown);
    parentSub.add(childSub);

    parentSub.remove(childSub);
    parentSub.unsubscribe();

    expect(childTeardown).not.toBeCalled();
    expect(parentTeardown).toBeCalledTimes(1);

    childSub.unsubscribe();
    expect(childTeardown).toBeCalledTimes(1);
    expect(parentTeardown).toBeCalledTimes(1);
  });
};

describe('RX', () => {
  describe('Subscription', testSubscription(Rx.Subscription as unknown as SubscriptionConstructor));
});

describe('Custom implementation', () => {
  describe('Subscription', testSubscription(Subscription));
});
