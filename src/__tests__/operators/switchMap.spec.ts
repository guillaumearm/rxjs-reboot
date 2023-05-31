import * as Rx from 'rxjs';
import * as RxOps from 'rxjs/operators';
import { Observable } from '../../Observable';

import { switchMap } from '../../operators/switchMap';
import { createSubject, dummyObservable$, of, toObservable } from '../../helpers/test-helpers';

type SwitchMapOperator = typeof switchMap;

/**
 * Tests
 */
const testSwitchMap = (switchMapOp: SwitchMapOperator) => () => {
  it('emit values through the inner observable then complete', () => {
    const final$ = switchMapOp<Observable<number>, number>(x => x)(of(dummyObservable$));

    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();

    const sub = final$.subscribe({
      next: onNext,
      error: onError,
      complete: onComplete,
    });

    expect(onNext.mock.calls[0]).toEqual([1]);
    expect(onNext.mock.calls[1]).toEqual([2]);
    expect(onNext.mock.calls[2]).toEqual([4]);

    expect(onNext).toBeCalledTimes(3);
    expect(onError).not.toHaveBeenCalled();
    expect(onComplete).toBeCalledTimes(1);

    expect(sub.closed).toBe(true);
  });

  it('should continue emit values through the inner observable even when source is completed', () => {
    const inner$ = createSubject<number>();
    const final$ = switchMapOp<Observable<number>, number>(x => x)(of(toObservable(inner$)));

    const onNext = jest.fn();

    const sub = final$.subscribe({
      next: onNext,
    });

    expect(onNext).not.toBeCalled();

    inner$.next(1);
    inner$.next(2);
    inner$.next(3);

    expect(onNext).toBeCalledTimes(3);
    expect(onNext.mock.calls).toEqual([[1], [2], [3]]);

    sub.unsubscribe();
  });

  it('emit values through multiple inner observable', () => {
    const main$ = createSubject<number>();
    const final$ = switchMapOp<number, number>(x => {
      return new Rx.Observable(obs => {
        obs.next(x);
        obs.complete();
      }) as unknown as Observable<number>;
    })(toObservable(main$));

    const onNext = jest.fn();
    const onComplete = jest.fn();

    const sub = final$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    expect(onNext).not.toBeCalled();
    expect(onComplete).not.toBeCalled();

    main$.next(1);
    main$.next(2);
    main$.next(3);

    expect(onNext.mock.calls).toEqual([[1], [2], [3]]);
    expect(onComplete).not.toBeCalled();

    main$.complete();
    expect(onComplete).toBeCalled();
    expect(sub.closed).toBe(true);
  });

  it('unsubscribe previous inner observable when a new value is emitted', () => {
    const main$ = createSubject<number>();

    const onSubscribe = jest.fn();
    const onUnsubscribe = jest.fn();

    const final$ = switchMapOp<number, number>(() => {
      return new Rx.Observable(() => {
        onSubscribe();
        return onUnsubscribe;
      }) as unknown as Observable<number>;
    })(toObservable(main$));

    const sub = final$.subscribe({});

    expect(onSubscribe).not.toBeCalled();
    expect(onUnsubscribe).not.toBeCalled();

    main$.next(42);

    expect(onSubscribe).toHaveBeenCalledTimes(1);
    expect(onUnsubscribe).not.toBeCalled();

    main$.next(42);
    expect(onSubscribe).toHaveBeenCalledTimes(2);
    expect(onUnsubscribe).toHaveBeenCalledTimes(1);

    sub.unsubscribe();
  });

  it('unsubscribe inner observable when source is unsubscribed', () => {
    const main$ = createSubject<number>();

    const onSubscribe = jest.fn();
    const onUnsubscribe = jest.fn();

    const final$ = switchMapOp<number, number>(() => {
      return new Rx.Observable(() => {
        onSubscribe();
        return onUnsubscribe;
      }) as unknown as Observable<number>;
    })(toObservable(main$));

    const sub = final$.subscribe({});

    main$.next(42);

    sub.unsubscribe();

    expect(onSubscribe).toHaveBeenCalledTimes(1);
    expect(onUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe only when source complete AND inner observable complete', () => {
    const inner$ = createSubject<number>();
    const main$ = createSubject<number>();

    const final$ = switchMapOp<number, number>(() => {
      return toObservable(inner$);
    })(toObservable(main$));

    const sub = final$.subscribe({});

    main$.next(42);
    main$.complete();

    expect(sub.closed).toBe(false);

    inner$.complete();
    expect(sub.closed).toBe(true);
  });

  it('should unsubscribe only when source complete AND inner observable emit an error', () => {
    const inner$ = createSubject<number>();
    const main$ = createSubject<number>();

    const onError = jest.fn();

    const final$ = switchMapOp<number, number>(() => {
      return toObservable(inner$);
    })(toObservable(main$));

    const sub = final$.subscribe({ error: onError });

    main$.next(42);
    main$.complete();

    expect(sub.closed).toBe(false);

    inner$.error('test');
    expect(sub.closed).toBe(true);
  });

  it('unsubscribe inner observable when source emit an error', () => {
    const main$ = createSubject<number>();

    const onError = jest.fn();
    const onSubscribe = jest.fn();
    const onUnsubscribe = jest.fn();

    const final$ = switchMapOp<number, number>(() => {
      return new Rx.Observable(() => {
        onSubscribe();
        return onUnsubscribe;
      }) as unknown as Observable<number>;
    })(toObservable(main$));

    const sub = final$.subscribe({ error: onError });

    main$.next(42);
    main$.error('test');

    expect(onSubscribe).toHaveBeenCalledTimes(1);
    expect(onUnsubscribe).toHaveBeenCalledTimes(1);

    expect(sub.closed).toBe(true);
  });

  it('emit an error when throw an error from the project function', () => {
    const main$ = createSubject<number>();
    const onError = jest.fn();

    const final$ = switchMapOp<number, number>(() => {
      throw 'test';
    })(toObservable(main$));

    const sub = final$.subscribe({
      error: onError,
    });

    main$.next(42);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('test');

    expect(sub.closed).toBe(true);
  });
};

describe('RX', () => {
  describe('switchMap', testSwitchMap(RxOps.switchMap as unknown as SwitchMapOperator));
});

describe('Custom implementation', () => {
  describe('switchMap', testSwitchMap(switchMap));
});
