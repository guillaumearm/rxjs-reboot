import * as Rx from 'rxjs';
import * as RxOps from 'rxjs/operators';

import { finalize } from '../../operators/finalize';
import { dummyErrorObservable$, dummyObservable$ } from '../../helpers/test-helpers';
import { Observable } from '../../Observable';

type finalizeOperator = typeof finalize;

const NEVER = new Rx.Observable(() => {}) as unknown as Observable<never>;

const testFinalize = (finalizeOp: finalizeOperator) => () => {
  it('finalize on completed', () => {
    const finalized = jest.fn();

    const result$ = finalizeOp(finalized)(dummyObservable$);

    const onNext = jest.fn();
    const onComplete = jest.fn();

    const sub = result$.subscribe({ next: onNext, complete: onComplete });

    expect(finalized).toHaveBeenCalledTimes(1);

    sub.unsubscribe();
  });

  it('finalize on error', async () => {
    const finalized = jest.fn();

    const result$ = finalizeOp(finalized)(dummyErrorObservable$);

    const onNext = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();

    const sub = result$.subscribe({ next: onNext, error: onError, complete: onComplete });

    expect(finalized).toHaveBeenCalledTimes(1);

    sub.unsubscribe();
  });

  it('finalize when unsubscribed', () => {
    const finalized = jest.fn();

    const result$ = finalizeOp(finalized)(NEVER);

    const sub = result$.subscribe({});

    expect(finalized).toHaveBeenCalledTimes(0);
    sub.unsubscribe();
    expect(finalized).toHaveBeenCalledTimes(1);
  });
};

describe('RX', () => {
  describe('finalize', testFinalize(RxOps.finalize as unknown as finalizeOperator));
});

describe('Custom implementation', () => {
  describe('finalize', testFinalize(finalize));
});
