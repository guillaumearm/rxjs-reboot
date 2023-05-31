import * as RxOps from 'rxjs/operators';

import { scan } from '../../operators/scan';
import { dummyErrorObservable$, dummyObservable$ } from '../../helpers/test-helpers';

type ScanOperator = typeof scan;

/**
 * Tests
 */
const testScan = (scanOp: ScanOperator) => () => {
  it('should scan values with a sum function then complete', () => {
    const result$ = scanOp<number, number>((acc, value) => acc + value, 0)(dummyObservable$);

    const onNext = jest.fn();
    const onComplete = jest.fn();
    const sub = result$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    expect(onNext.mock.calls[0]).toEqual([1]);
    expect(onNext.mock.calls[1]).toEqual([3]);
    expect(onNext.mock.calls[2]).toEqual([7]);

    expect(onNext).toHaveBeenCalledTimes(3);
    expect(onComplete).toHaveBeenCalledTimes(1);

    sub.unsubscribe();
  });

  it('should forward error from the source', () => {
    const result$ = scanOp<number, number>((acc, value) => acc + value, 0)(dummyErrorObservable$);

    const onError = jest.fn();
    const sub = result$.subscribe({
      error: onError,
    });

    expect(onError).toHaveBeenCalledWith('test');
    expect(onError).toHaveBeenCalledTimes(1);

    sub.unsubscribe();
  });

  it('should forward error from the map project function', () => {
    const result$ = scanOp<number, number>(() => {
      throw 'woops';
    }, 0)(dummyObservable$);

    const onError = jest.fn();
    const sub = result$.subscribe({
      error: onError,
    });

    expect(onError).toHaveBeenCalledWith('woops');
    expect(onError).toHaveBeenCalledTimes(1);

    sub.unsubscribe();
  });

  it('should have a cold behavior', () => {
    const onNext = jest.fn();
    const mockedFn = jest.fn();

    const result$ = scanOp<number, number>((acc, value) => {
      mockedFn();
      return acc + value;
    }, 0)(dummyObservable$);

    const sub1 = result$.subscribe({ next: onNext });
    const sub2 = result$.subscribe({ next: onNext });

    expect(mockedFn).toBeCalledTimes(6);
    expect(onNext.mock.calls).toEqual([[1], [3], [7], [1], [3], [7]]);

    sub1.unsubscribe();
    sub2.unsubscribe();
  });
};

describe('RX', () => {
  describe('scan', testScan(RxOps.scan as unknown as ScanOperator));
});

describe('Custom implementation', () => {
  describe('scan', testScan(scan));
});
