# `rxjs-reboot`

Diving into the Core of [RxJS](https://rxjs.dev/guide/overview) Step by Step

## Purpose

`rxjs-reboot` is a project dedicated to learning more about RxJS, a library for handling asynchronous data and events in JavaScript/TypeScript. RxJS is packed full of features and can sometimes feel a bit overwhelming.

This project is obviously not about trying to compete with or replace RxJS. Instead, we're on a learning journey where we try to build some of RxJS's basic functionalities from scratch.

By doing this, we aim to understand better the ideas and design patterns that make RxJS work. The goal is simply to grow our understanding for RxJS and the ideas of reactive programming.

## Init the repo

1. git clone the repo
2. `yarn install`
3. `yarn run check:all`

Note: `yarn run check:all` is equivalent to `yarn run build && yarn run lint`

### Step 1: Subscription

```bash
yarn run step1
```

A Subscription is like a bridge between an Observable and an Observer, representing the ongoing execution of the Observable. It has the primary role of controlling the Observable execution and resource cleanup.

The key aspect of a Subscription is the unsubscribe method, which allows you to cancel the execution. When invoked, it stops the Observable from emitting values and releases any resources it has taken up. In addition, a Subscription can be checked to see if it's still active or closed. Subscriptions can also contain other Subscriptions - they can be added to or removed from the parent Subscription, allowing for grouped handling and mass unsubscription.

### Step 2: Subscriber

```bash
yarn run step2
```

A Subscriber is essentially an Observer that is also a Subscription. An Observer, in this context, is an object with three methods: next, error, and complete. These methods correspond to different ways an Observable can communicate with its observers. next is called to deliver a new value, error is used when an Observable encounters an error, and complete is signaled when the Observable has finished sending values.

On the other hand, a Subscriber, being also a Subscription, holds the ability to unsubscribe from the Observable it is listening to. It means, in addition to reacting to values, errors, or completion signals from an Observable, a Subscriber can also decide to stop listening entirely. By combining the characteristics of an Observer with the control of a Subscription, a Subscriber forms a critical link in the chain of reactive programming.

### Step 3: Observable

```bash
yarn run step3
```

An Observable represents the concept of an invokable collection of future values or events. It is the source of data in the RxJS universe. In essence, an Observable is a function with a special contract: it takes an Observer and attaches it to the data source, then returns a Subscription.

When you subscribe to an Observable, you are essentially invoking the function and supplying it with an Observer. This Observer will then listen for next, error, or complete calls to react accordingly.

The subscribe function returns a Subscription, which represents the ongoing execution of the Observable and allows the consumer to cancel the execution if it's no longer interested in the result, or if it wants to prevent memory leaks or unnecessary computation. The Subscription mechanism provides a clear way to start and stop the delivery of values and clean up any resources that might have been set up for data production.

This pattern allows Observables to be chained together and enables the power of functional reactive programming by transforming, combining, and controlling asynchronous events in a predictable manner.

### Step 4: Subject

```bash
yarn run step4
```

A Subject in RxJS is a special type of Observable that allows values to be multicasted to many Observers. While plain Observables are unicast (each subscribed Observer owns an independent execution of the Observable), Subjects are multicast.

A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners.

In other words, a Subject is both an Observer and an Observable. It means you can directly push values to it using the next method, or signal the completion using complete, and it can also be subscribed to. When a value is pushed via next, it is propagated to all subscribed observers. Similarly, when complete or error is called, the signal is sent to all subscribers.

This feature makes Subjects perfect for broadcasting values or events to multiple observers, which comes handy in a variety of scenarios in modern web development, including status updates, real-time data streaming, and even handling user interface events.

### Step 5: map operator

```bash
yarn run step5
```

The map operator is one of the most frequently used tools in RxJS. Just like in the world of arrays where you use the map function to transform elements, in RxJS you use the map operator to transform values emitted by an Observable.

When you pass a function into the map operator, it will apply this function to every value the Observable emits. For instance, if you have an Observable that emits numbers, you can use map to create a new Observable that emits each of those numbers multiplied by two.

This is the essence of the map operator – applying a transformation to each value and creating a new Observable that emits the transformed values. In short, it's about transforming the data you receive into the data you need.

### Step 6: scan operator

```bash
yarn run step6
```

The scan operator in RxJS is similar to the reduce function that you might be familiar with from JavaScript arrays. But instead of operating on an array and producing a single result, scan operates on an Observable and produces another Observable that emits the accumulated result each time the source Observable emits a value.

You provide scan with an accumulator function that determines how to combine the previous accumulated result with the next value from the source Observable. You also provide a seed value that serves as the initial accumulated value.

Each time the source Observable emits a value, scan applies the accumulator function to the current accumulated value and the new source value, and emits the result. This allows you to maintain state between emissions and progressively build up a final result.

For example, if you have an Observable that emits numbers and you want to keep a running total, you could use scan to add each new number to the accumulated total and emit the result. It's a powerful tool for managing state in your applications.

### Step 7: retry operator

```bash
yarn run step7
```

The retry operator in RxJS is a powerful tool for handling errors and failures in asynchronous operations. It operates on an Observable and returns a new Observable.

Whenever the source Observable encounters an error, instead of forwarding that error to its subscribers and stopping the execution, the retry operator resubscribes to the source Observable in an attempt to restart the failed operation. This process can be repeated until the operation succeeds or a specified retry limit is reached.

The retry operator can optionally take a parameter that sets the maximum number of retries. If the operation continues to fail after this many attempts, then the retry operator will stop retrying and will forward the error to its subscribers.

For instance, if you're making a network request and it fails due to a temporary network glitch, retry can automatically retry the request. This saves you from having to manually resubscribe and makes your application more resilient to temporary failures.

### Step 8: finalize operator

```bash
yarn run step8
```

The finalize operator in RxJS is used to perform actions when an Observable completes, whether it finishes successfully or ends with an error. This operator is commonly used for cleanup tasks.

It works by taking a callback function as a parameter. This callback function will be executed when the source Observable completes, regardless of whether it completed normally or due to an error.

For example, if you have an Observable that performs a network request, you might use finalize to hide a loading spinner when the request completes, irrespective of whether the request was successful or not.

The finalize operator returns a new Observable that behaves exactly like the source Observable, except for calling the finalize callback upon completion. It's a valuable tool for ensuring that certain code always runs when an Observable completes.

### Step 9: switchMap operator

```bash
yarn run step9
```

The switchMap operator is one of the most widely used operators in RxJS, especially when dealing with asynchronous actions or side-effects like HTTP requests.

switchMap is a function that takes a function as an argument. This argument function is expected to return an Observable. The switchMap operator "flattens" the output, meaning it transforms an Observable that emits Observables (a higher-order Observable) into an Observable that emits the output values of those inner Observables directly.

One crucial characteristic of switchMap is that it will "switch" from the current inner Observable to a new one as soon as the source Observable emits a value. In other words, if a previous inner Observable is still emitting values when the source Observable emits a new value, switchMap will stop listening to that previous inner Observable and start listening to the new one.

This behavior is particularly useful in scenarios like search-as-you-type features where you want to cancel previous asynchronous requests and keep only the results of the latest request. By automatically canceling previous subscriptions and switching to new ones, switchMap helps to keep your data flow simple and efficient.
