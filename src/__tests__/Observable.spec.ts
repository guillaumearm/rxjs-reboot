import 'jest-extended';
import * as Rx from 'rxjs';

import { Observable, ObservableConstructor } from '../Observable';
import { Observer } from '../Observer';

const testObservable = (ObservableClass: ObservableConstructor) => () => {
  it('[constructor] an error should be emitted on throw', () => {
    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();
    const obs: Observer<unknown> = { next: onNext, error: onError, complete: onComplete };

    const o$ = new ObservableClass(() => {
      throw 'ERROR';
    });

    const sub = o$.subscribe(obs);

    expect(onError).toBeCalledWith('ERROR');
    expect(onNext).not.toBeCalled();
    expect(onComplete).not.toBeCalled();

    expect(sub.closed).toBe(true);
  });

  it('[constructor] subscription should be closed on error', () => {
    const obs: Partial<Observer<unknown>> = { error: jest.fn() };

    const o$ = new ObservableClass(() => {
      throw 'ERROR';
    });

    const sub = o$.subscribe(obs);

    expect(sub.closed).toBe(true);
  });

  it('[next]', () => {
    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();
    const obs: Observer<unknown> = { next: onNext, error: onError, complete: onComplete };

    const o$ = new ObservableClass(observer => {
      observer.next(42);
    });

    const sub = o$.subscribe(obs);

    expect(onNext).toBeCalledWith(42);
    expect(onNext).toBeCalledTimes(1);
    expect(onComplete).not.toBeCalled();
    expect(onError).not.toBeCalled();

    expect(sub.closed).toBe(false);
  });

  it('[next/complete]', () => {
    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();
    const obs: Observer<unknown> = { next: onNext, error: onError, complete: onComplete };

    const o$ = new ObservableClass(observer => {
      observer.next(42);
      observer.complete();
    });
    const sub = o$.subscribe(obs);

    expect(onNext).toBeCalledWith(42);
    expect(onNext).toBeCalledTimes(1);
    expect(onComplete).toBeCalledTimes(1);
    expect(onError).not.toBeCalled();
    expect(sub.closed).toBe(true);
  });

  it('[next/error]', () => {
    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();
    const obs: Observer<unknown> = { next: onNext, error: onError, complete: onComplete };

    const o$ = new ObservableClass(observer => {
      observer.next(42);
      observer.error('dummy error');
    });
    const sub = o$.subscribe(obs);

    expect(onNext).toBeCalledWith(42);
    expect(onNext).toBeCalledTimes(1);
    expect(onComplete).not.toBeCalled();
    expect(onError).toHaveBeenCalledWith('dummy error');
    expect(onError).toHaveBeenCalledTimes(1);
    expect(sub.closed).toBe(true);
  });

  it('[next] several values', () => {
    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();
    const obs: Observer<unknown> = { next: onNext, error: onError, complete: onComplete };

    const o$ = new ObservableClass(observer => {
      observer.next(-84);
      observer.next(-42);
      observer.next(42);
      observer.next(84);
    });
    const sub = o$.subscribe(obs);

    expect(onNext).toHaveBeenNthCalledWith(1, -84);
    expect(onNext).toHaveBeenNthCalledWith(2, -42);
    expect(onNext).toHaveBeenNthCalledWith(3, 42);
    expect(onNext).toHaveBeenNthCalledWith(4, 84);
    expect(onNext).toBeCalledTimes(4);
    expect(onComplete).not.toBeCalled();
    expect(onError).not.toBeCalled();
    expect(sub.closed).toBe(false);
  });

  it('[next/complete] several values', () => {
    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();
    const obs: Observer<unknown> = { next: onNext, error: onError, complete: onComplete };

    const o$ = new ObservableClass(observer => {
      observer.next(-84);
      observer.next(-42);
      observer.next(42);
      observer.next(84);
      observer.complete();
    });
    const sub = o$.subscribe(obs);

    expect(onNext).toHaveBeenNthCalledWith(1, -84);
    expect(onNext).toHaveBeenNthCalledWith(2, -42);
    expect(onNext).toHaveBeenNthCalledWith(3, 42);
    expect(onNext).toHaveBeenNthCalledWith(4, 84);
    expect(onNext).toBeCalledTimes(4);
    expect(onComplete).toBeCalledTimes(1);
    expect(onError).not.toBeCalled();
    expect(sub.closed).toBe(true);
  });

  it('[next/error] several values', () => {
    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();
    const obs: Observer<unknown> = { next: onNext, error: onError, complete: onComplete };

    const o$ = new ObservableClass(observer => {
      observer.next(-84);
      observer.next(-42);
      observer.next(42);
      observer.next(84);
      observer.error('dummy error');
    });
    const sub = o$.subscribe(obs);

    expect(onNext).toHaveBeenNthCalledWith(1, -84);
    expect(onNext).toHaveBeenNthCalledWith(2, -42);
    expect(onNext).toHaveBeenNthCalledWith(3, 42);
    expect(onNext).toHaveBeenNthCalledWith(4, 84);
    expect(onNext).toBeCalledTimes(4);
    expect(onComplete).not.toBeCalled();
    expect(onError).toBeCalledTimes(1);
    expect(onError).toBeCalledWith('dummy error');
    expect(sub.closed).toBe(true);
  });

  it('[next] with 2 subscriptions', () => {
    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();
    const obs: Observer<unknown> = { next: onNext, error: onError, complete: onComplete };

    const o$ = new ObservableClass(observer => {
      observer.next(42);
    });

    const subA = o$.subscribe(obs);
    expect(onNext).toBeCalledTimes(1);

    const subB = o$.subscribe(obs);
    expect(subA.closed).toBe(false);
    expect(subB.closed).toBe(false);

    expect(onNext).toHaveBeenNthCalledWith(1, 42);
    expect(onNext).toHaveBeenNthCalledWith(2, 42);
    expect(onNext).toBeCalledTimes(2);
    expect(onComplete).not.toBeCalled();
    expect(onError).not.toBeCalled();
  });

  it('[complete] with 2 subscriptions', () => {
    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();
    const obs: Observer<unknown> = { next: onNext, error: onError, complete: onComplete };

    const o$ = new ObservableClass(observer => {
      observer.complete();
    });

    const subA = o$.subscribe(obs);
    expect(subA.closed).toBe(true);
    expect(onComplete).toBeCalledTimes(1);

    const subB = o$.subscribe(obs);
    expect(subB.closed).toBe(true);

    expect(onComplete).toBeCalledTimes(2);
    expect(onNext).not.toBeCalled();
    expect(onError).not.toBeCalled();
  });

  it('[error] with 2 subscriptions', () => {
    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();
    const obs: Observer<unknown> = { next: onNext, error: onError, complete: onComplete };

    const o$ = new ObservableClass(observer => {
      observer.error('dummy error');
    });

    const subA = o$.subscribe(obs);
    expect(subA.closed).toBe(true);
    expect(onError).toBeCalledTimes(1);
    expect(onError).toBeCalledWith('dummy error');

    const subB = o$.subscribe(obs);
    expect(subB.closed).toBe(true);
    expect(onError).toBeCalledTimes(2);
    expect(onError).toHaveBeenNthCalledWith(2, 'dummy error');
    expect(onComplete).not.toBeCalled();
    expect(onNext).not.toBeCalled();
  });

  it('[unsubscribe] should pass the closed boolen to true', () => {
    const o$ = new ObservableClass(() => {});
    const sub = o$.subscribe({});

    expect(sub.closed).toBe(false);

    sub.unsubscribe();

    expect(sub.closed).toBe(true);
  });

  it('[unsubscribe] teardown should be called on unsubscribe', () => {
    const teardown = jest.fn();
    const o$ = new ObservableClass(() => teardown);

    expect(teardown).not.toBeCalled();

    const sub = o$.subscribe({});
    expect(teardown).not.toBeCalled();

    sub.unsubscribe();
    sub.unsubscribe();
    expect(teardown).toBeCalledTimes(1);

    o$.subscribe({}).unsubscribe();
    expect(teardown).toBeCalledTimes(2);
  });

  it('[complete] teardown should be called on complete', () => {
    const teardown = jest.fn();
    const o$ = new ObservableClass(observer => {
      observer.complete();
      return teardown;
    });

    const sub = o$.subscribe({});
    expect(teardown).toBeCalledTimes(1);

    sub.unsubscribe();
    expect(teardown).toBeCalledTimes(1);

    o$.subscribe({}).unsubscribe();
    expect(teardown).toBeCalledTimes(2);
  });

  it('[error] teardown should be called on error', () => {
    const teardown = jest.fn();
    const o$ = new ObservableClass(observer => {
      observer.error('dummy error');
      return teardown;
    });

    const sub = o$.subscribe({ error: jest.fn() });
    expect(teardown).toBeCalledTimes(1);

    sub.unsubscribe();
    expect(teardown).toBeCalledTimes(1);

    o$.subscribe({ error: jest.fn() }).unsubscribe();
    expect(teardown).toBeCalledTimes(2);
  });
};

describe('RX', () => {
  describe('Observable', testObservable(Rx.Observable as unknown as ObservableConstructor));
});

describe('Custom implementation', () => {
  describe('Observable', testObservable(Observable));
});
