import 'jest-extended';
import * as Rx from 'rxjs';

import { Subject, SubjectConstructor } from '../Subject';

const testSubject = (SubjectClass: SubjectConstructor) => () => {
  it('[next] several values', () => {
    const subject = new SubjectClass<number>();
    const onNext = jest.fn();
    const sub = subject.subscribe({ next: onNext });

    subject.next(10);
    subject.next(20);
    subject.next(30);

    expect(onNext.mock.calls[0]).toEqual([10]);
    expect(onNext.mock.calls[1]).toEqual([20]);
    expect(onNext.mock.calls[2]).toEqual([30]);

    sub.unsubscribe();
  });

  it('[next] several values for several subscriber', () => {
    const subject = new SubjectClass<number>();
    const onNext1 = jest.fn();
    const onNext2 = jest.fn();
    const sub1 = subject.subscribe({ next: onNext1 });
    const sub2 = subject.subscribe({ next: onNext2 });

    subject.next(10);
    subject.next(20);
    subject.next(30);

    expect(onNext1.mock.calls[0]).toEqual([10]);
    expect(onNext1.mock.calls[1]).toEqual([20]);
    expect(onNext1.mock.calls[2]).toEqual([30]);

    expect(onNext2.mock.calls[0]).toEqual([10]);
    expect(onNext2.mock.calls[1]).toEqual([20]);
    expect(onNext2.mock.calls[2]).toEqual([30]);

    sub1.unsubscribe();
    sub2.unsubscribe();
  });

  it('[complete] should block next and error', () => {
    const subject = new SubjectClass<number>();
    const onNext = jest.fn();
    const onError = jest.fn();

    const sub = subject.subscribe({ next: onNext, error: onError });

    subject.complete();

    subject.next(1);
    subject.error('test');

    expect(onNext).not.toBeCalled();
    expect(onError).not.toBeCalled();

    sub.unsubscribe();
  });

  it('[complete] should complete', () => {
    const subject = new SubjectClass<number>();
    const onComplete = jest.fn();

    const sub = subject.subscribe({ complete: onComplete });

    subject.complete();

    expect(onComplete).toBeCalled();

    sub.unsubscribe();
  });

  it('[complete] should complete once', () => {
    const subject = new SubjectClass<number>();
    const onComplete = jest.fn();

    const sub = subject.subscribe({ complete: onComplete });

    subject.complete();
    subject.complete();
    subject.complete();

    expect(onComplete).toBeCalledTimes(1);

    sub.unsubscribe();
  });

  it('[complete] should unsubscribe all listeners', () => {
    const subject = new SubjectClass<number>();
    const teardown1 = jest.fn();
    const teardown2 = jest.fn();
    const teardown3 = jest.fn();

    const sub1 = subject.subscribe({});
    const sub2 = subject.subscribe({});
    const sub3 = subject.subscribe({});

    sub1.add(teardown1);
    sub2.add(teardown2);
    sub3.add(teardown3);

    subject.complete();

    expect(teardown1).toHaveBeenCalledTimes(1);
    expect(teardown2).toHaveBeenCalledTimes(1);
    expect(teardown3).toHaveBeenCalledTimes(1);

    expect(sub1.closed).toBe(true);
    expect(sub2.closed).toBe(true);
    expect(sub3.closed).toBe(true);
  });

  it('[complete] subscribe on a completed subject should complete immediatly', () => {
    const subject = new SubjectClass<number>();
    const onComplete = jest.fn();

    subject.complete();

    const sub = subject.subscribe({ complete: onComplete });

    expect(onComplete).toBeCalled();
    expect(sub.closed).toBe(true);
  });

  it('[error] should block next and complete', () => {
    const subject = new SubjectClass<number>();
    const onNext = jest.fn();
    const onComplete = jest.fn();
    const onError = jest.fn();

    const sub = subject.subscribe({ next: onNext, complete: onComplete, error: onError });

    subject.error('test');
    subject.next(1);
    subject.complete();

    expect(onNext).not.toBeCalled();
    expect(onComplete).not.toBeCalled();

    sub.unsubscribe();
  });

  it('[error] should emit error once', () => {
    const subject = new SubjectClass<number>();
    const onError = jest.fn();

    const sub = subject.subscribe({ error: onError });

    subject.error('test');
    subject.error('test');
    subject.error('test');

    expect(onError).toBeCalledTimes(1);
    expect(onError).toBeCalledWith('test');

    sub.unsubscribe();
  });

  it('[error] should unsubscribe all listeners', () => {
    const subject = new SubjectClass<number>();
    const teardown1 = jest.fn();
    const teardown2 = jest.fn();
    const teardown3 = jest.fn();
    const onError = jest.fn();

    const sub1 = subject.subscribe({ error: onError });
    const sub2 = subject.subscribe({ error: onError });
    const sub3 = subject.subscribe({ error: onError });

    sub1.add(teardown1);
    sub2.add(teardown2);
    sub3.add(teardown3);

    subject.error('test');

    expect(teardown1).toHaveBeenCalledTimes(1);
    expect(teardown2).toHaveBeenCalledTimes(1);
    expect(teardown3).toHaveBeenCalledTimes(1);

    expect(sub1.closed).toBe(true);
    expect(sub2.closed).toBe(true);
    expect(sub3.closed).toBe(true);
  });

  it('[error] subscribe on a completed subject caused by an error should replay this error', () => {
    const subject = new SubjectClass<number>();
    const onError = jest.fn();
    const onComplete = jest.fn();

    subject.error('test');

    const sub = subject.subscribe({ error: onError, complete: onComplete });

    expect(onError).toBeCalledWith('test');
    expect(onComplete).not.toBeCalled();
    expect(sub.closed).toBe(true);
  });

  it('[subscription] added teardown should be executed once on complete', () => {
    const subject = new SubjectClass<number>();
    const teardown = jest.fn();

    const sub = subject.subscribe({});
    sub.add(teardown);

    subject.complete();
    expect(teardown).toBeCalled();

    sub.unsubscribe();
    expect(teardown).toHaveBeenCalledTimes(1);
  });
};

describe('RX', () => {
  describe('Subject', testSubject(Rx.Subject as unknown as SubjectConstructor));
});

describe('Custom implementation', () => {
  describe('Subject', testSubject(Subject));
});
