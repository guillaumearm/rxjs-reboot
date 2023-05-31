import * as RxOps from 'rxjs/operators';

import { map } from '../../operators/map';
import { dummyErrorObservable$, dummyObservable$ } from '../../helpers/test-helpers';

type MapOperator = typeof map;

const testMap = (mapOp: MapOperator) => () => {
  it('should map values then complete', () => {
    const result$ = mapOp<number, number>(x => x * 2)(dummyObservable$);

    const onNext = jest.fn();
    const onComplete = jest.fn();
    const sub = result$.subscribe({ next: onNext, complete: onComplete });

    expect(onNext.mock.calls[0]).toEqual([2]);
    expect(onNext.mock.calls[1]).toEqual([4]);
    expect(onNext.mock.calls[2]).toEqual([8]);

    expect(onNext).toHaveBeenCalledTimes(3);
    expect(onComplete).toHaveBeenCalledTimes(1);

    sub.unsubscribe();
  });

  it('should forward error from the source', () => {
    const result$ = mapOp<number, number>(x => x * 2)(dummyErrorObservable$);

    const onError = jest.fn();
    const sub = result$.subscribe({ error: onError });

    expect(onError).toHaveBeenCalledWith('test');
    expect(onError).toHaveBeenCalledTimes(1);

    sub.unsubscribe();
  });

  it('should forward error from the map project function', () => {
    const result$ = mapOp<number, number>(() => {
      throw 'woops';
    })(dummyObservable$);

    const onError = jest.fn();
    const sub = result$.subscribe({ error: onError });

    expect(onError).toHaveBeenCalledWith('woops');
    expect(onError).toHaveBeenCalledTimes(1);

    sub.unsubscribe();
  });

  it('should have a cold behavior', () => {
    const onNext = jest.fn();
    const mockedProjectFn = jest.fn((x: number) => x * 2);

    const result$ = mapOp<number, number>(mockedProjectFn)(dummyObservable$);

    const sub1 = result$.subscribe({ next: onNext });
    const sub2 = result$.subscribe({ next: onNext });

    expect(mockedProjectFn).toBeCalledTimes(6);
    expect(onNext.mock.calls).toEqual([[2], [4], [8], [2], [4], [8]]);

    sub1.unsubscribe();
    sub2.unsubscribe();
  });
};

describe('RX', () => {
  describe('map', testMap(RxOps.map as unknown as MapOperator));
});

describe('Custom implementation', () => {
  describe('map', testMap(map));
});
