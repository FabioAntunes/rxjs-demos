import { fromEvent } from 'rxjs/observable/fromEvent'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

// the BehaviorSubject it's similar to the subject, with one little difference
// it has initial value, so as soon you subscribe to it, it will emit instantly
// in this case, it will emit the window height and half the width
export const resize$ = new BehaviorSubject({
  width: window.innerWidth / 2,
  height: window.innerHeight,
})

// we subscirbe to the window resize event
// and because a subject is a an observable and observer, we can pass the resize$ as an argument
// so whenever a resize event happens, that value will be passed to the resize$
fromEvent(window, 'resize')
  .map(() => ({ width: window.innerWidth / 2, height: window.innerHeight }))
  .subscribe(resize$)

// in other words the above can be expressed as:
// fromEvent(window, 'resize')
//   .map(() => ({ width: window.innerWidth / 2, height: window.innerHeight }))
//   .subscribe(val => resize$.next(val))
