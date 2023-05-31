export type OnNext<T> = (value: T) => void;
export type OnError = (error: unknown) => void;
export type OnComplete = () => void;

export type Observer<T> = {
  next: OnNext<T>;
  error: OnError;
  complete: OnComplete;
};
