import 'jest-extended';
import * as Rx from 'rxjs';

import { Subscriber, SubscriberConstructor } from '../Subscriber';
import { Observer } from '../Observer';

const getObserver = <T>(): Observer<T> => {
  return { next: jest.fn(), error: jest.fn(), complete: jest.fn() };
};

const testSubscriber = (SubscriberClass: SubscriberConstructor) => () => {
  it('[closed] should be false before then true on unsubscribe', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    expect(subscriber.closed).toBe(false);
    subscriber.unsubscribe();
    expect(subscriber.closed).toBe(true);
  });

  it('[closed] should be false before then true on error', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    expect(subscriber.closed).toBe(false);
    subscriber.error('dummy error');
    expect(subscriber.closed).toBe(true);
  });

  it('[closed] should be false before then true on complete', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    expect(subscriber.closed).toBe(false);
    subscriber.complete();
    expect(subscriber.closed).toBe(true);
  });

  it('[next] should call onNext with given values', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.next('a');
    subscriber.next('b');
    subscriber.next('c');

    expect(obs.next).toHaveBeenNthCalledWith(1, 'a');
    expect(obs.next).toHaveBeenNthCalledWith(2, 'b');
    expect(obs.next).toHaveBeenNthCalledWith(3, 'c');
  });

  it('[next] cannot call next after error', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.next('a');

    subscriber.error('dummy error');

    subscriber.next('b');
    subscriber.next('c');

    expect(obs.next).toHaveBeenCalledTimes(1);
  });

  it('[next] cannot call next after complete', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.next('a');

    subscriber.complete();

    subscriber.next('b');
    subscriber.next('c');

    expect(obs.next).toHaveBeenCalledTimes(1);
  });

  it('[next] cannot call next after unsubscribe', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.next('a');

    subscriber.unsubscribe();

    subscriber.next('b');
    subscriber.next('c');

    expect(obs.next).toHaveBeenCalledTimes(1);
  });

  it('[error] should call onError (once) with given error', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.error('dummy error');
    subscriber.error('dummy error 2 (should be ignored');

    expect(obs.error).toHaveBeenCalledTimes(1);
    expect(obs.error).toHaveBeenCalledWith('dummy error');
  });

  it('[error] should call onError before unsubscribe', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    const onUnsubscribe = jest.fn();
    subscriber.add(onUnsubscribe);

    subscriber.error('dummy error');
    subscriber.error('dummy error 2 (should be ignored');

    expect(obs.error).toHaveBeenCalledTimes(1);
    expect(obs.error).toHaveBeenCalledWith('dummy error');
    expect(onUnsubscribe).toHaveBeenCalledTimes(1);

    expect(obs.error).toHaveBeenCalledBefore(onUnsubscribe);
    expect(obs.error).toHaveBeenCalledBefore(onUnsubscribe);
  });

  it('[error] should ignore errors when completed', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.complete();
    subscriber.error('dummy error (should be ignored)');
    subscriber.error('dummy error 2 (should be ignored');

    expect(obs.error).toHaveBeenCalledTimes(0);
  });

  it('[error] should ignore errors after unsubscribe', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.unsubscribe();
    subscriber.error('dummy error (should be ignored)');
    subscriber.error('dummy error 2 (should be ignored');

    expect(obs.error).toHaveBeenCalledTimes(0);
  });

  it('[complete] should call onComplete (once)', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.complete();
    subscriber.complete();

    expect(obs.complete).toHaveBeenCalledTimes(1);
  });

  it('[complete] should call onComplete before unsubscribe', () => {
    const onUnsubscribe = jest.fn();

    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.add(onUnsubscribe);

    subscriber.complete();

    expect(obs.complete).toHaveBeenCalledTimes(1);
    expect(onUnsubscribe).toHaveBeenCalledTimes(1);

    expect(obs.complete).toHaveBeenCalledBefore(onUnsubscribe);
  });

  it('[complete] should not call onComplete after error', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.error('dummy error');
    subscriber.complete();

    expect(obs.complete).toHaveBeenCalledTimes(0);
  });

  it('[complete] should not call onComplete after unsubscribe', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.unsubscribe();
    subscriber.complete();

    expect(obs.complete).toHaveBeenCalledTimes(0);
  });

  it('[unsubscribe] should not call onNext/onError/onComplete', () => {
    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.unsubscribe();

    expect(obs.next).not.toBeCalled();
    expect(obs.error).not.toBeCalled();
    expect(obs.complete).not.toBeCalled();
  });

  it('[add] added teardowns are called once on unsubscribe', () => {
    const teardownA = jest.fn();
    const teardownB = jest.fn();

    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.add(teardownA);
    subscriber.add(teardownB);

    subscriber.unsubscribe();
    subscriber.unsubscribe();

    expect(teardownA).toBeCalledTimes(1);
    expect(teardownB).toBeCalledTimes(1);
  });

  it('[add] added teardowns are called once on complete', () => {
    const teardownA = jest.fn();
    const teardownB = jest.fn();

    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.add(teardownA);
    subscriber.add(teardownB);

    subscriber.complete();
    subscriber.complete();

    expect(teardownA).toBeCalledTimes(1);
    expect(teardownB).toBeCalledTimes(1);
  });

  it('[add] added teardowns are called once on error', () => {
    const teardownA = jest.fn();
    const teardownB = jest.fn();

    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.add(teardownA);
    subscriber.add(teardownB);

    subscriber.error('dummy error');
    subscriber.error('dummy error 2');

    expect(teardownA).toBeCalledTimes(1);
    expect(teardownB).toBeCalledTimes(1);
  });

  it('[remove] removed teardowns are not called on unsubscribe', () => {
    const subA = { unsubscribe: jest.fn() };
    const subB = { unsubscribe: jest.fn() };

    const obs = getObserver();
    const subscriber = new SubscriberClass(obs);

    subscriber.add(subA);
    subscriber.add(subB);

    subscriber.remove(subA);
    subscriber.remove(subB);

    subscriber.unsubscribe();

    expect(subA.unsubscribe).not.toBeCalled();
    expect(subB.unsubscribe).not.toBeCalled();
  });
};

describe('RX', () => {
  describe('Subscriber', testSubscriber(Rx.Subscriber as SubscriberConstructor));
});

describe('Custom implementation', () => {
  describe('Subscriber', testSubscriber(Subscriber));
});
