import * as Rx from 'rxjs';
import * as RxOps from 'rxjs/operators';
import { Observable } from '../../Observable';

import { retry } from '../../operators/retry';
import { dummyObservable$ } from '../../helpers/test-helpers';

type RetryOperator = typeof retry;

const testRetry = (retryOp: RetryOperator) => () => {
  it('should next values then complete', () => {
    const final$ = retryOp()(dummyObservable$);

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

    expect(onNext).toHaveBeenCalledTimes(3);
    expect(onComplete).toHaveBeenCalledTimes(1);

    sub.unsubscribe();
  });

  it('should retry the observable on error indefinitely until complete', () => {
    let i = 0;
    const main$ = new Rx.Observable<number>(obs => {
      i = i + 1;
      if (i <= 3) {
        obs.next(i);
        obs.error('test');
      }
    }) as unknown as Observable<number>;

    const final$ = retryOp()(main$);

    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();

    const sub = final$.subscribe({
      next: onNext,
      error: onError,
      complete: onComplete,
    });

    expect(onNext.mock.calls).toEqual([[1], [2], [3]]);
    expect(onError).not.toBeCalled();
    expect(onComplete).not.toBeCalled();

    sub.unsubscribe();
  });

  it('should retry the observable on error three times then emit the error', () => {
    const main$ = new Rx.Observable<number>(obs => {
      obs.next(42);
      obs.error('test');
    }) as unknown as Observable<number>;

    const final$ = retryOp(3)(main$);

    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();

    const sub = final$.subscribe({
      next: onNext,
      error: onError,
      complete: onComplete,
    });

    // initial value + 3 replayed values
    expect(onNext.mock.calls).toEqual([[42], [42], [42], [42]]);
    expect(onError).toBeCalledTimes(1);
    expect(onError).toBeCalledWith('test');

    expect(onComplete).not.toBeCalled();

    sub.unsubscribe();
  });
};

describe('RX', () => {
  describe('map', testRetry(RxOps.retry as unknown as RetryOperator));
});

describe('Custom implementation', () => {
  describe('map', testRetry(retry));
});
