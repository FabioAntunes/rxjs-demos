import { Subject } from 'rxjs/Subject'
import { Scheduler } from 'rxjs/Scheduler'
import { fromEvent } from 'rxjs/observable/fromEvent'
import { interval } from 'rxjs/observable/interval'
import { never } from 'rxjs/observable/never'
import { merge } from 'rxjs/observable/merge'
import { filter } from 'rxjs/operators/filter'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/scan'
import 'rxjs/add/operator/withLatestFrom'
import { resize$ } from './window-resize'
import { render, update } from './pong'

const filterKeys = filter(({ key }) => key === 'w' || key === 'e')

// observable to listen for the keyup event
const keyUp$ = fromEvent(document, 'keyup')
  .pipe(filterKeys)
  .map(({ key }) => ({ [key]: false }))

// observable to listen to the keydown
// we pipe our filter, so we can filter only the events of the specific keys
const keyDown$ = fromEvent(document, 'keydown')
  .pipe(filterKeys)
  .map(({ key }) => ({ [key]: true }))

// we will be merging keyUp$ and keyDown$ and scan (same as Array.prototype.reduce)
// because there is no such thing as an event for key pressed
// our keysPressed object will be something like
// { w: true, s: false }
// this observable will emit whenever there's a keyup event or a keydown
const keysPressed$ = merge(keyUp$, keyDown$).scan(
  (keysPressed, key) => ({
    ...keysPressed,
    ...key,
  }),
  {}
)

// we will have this obervable emit contstantly, using a scheduler, so whenever our animationFrame is "free"
// it will emit a number, in this case we are not interested in the value that is emitted we just want to run something
// on every requestAnimationFrame
const animationFrame$ = interval(0, Scheduler.animationFrame)

// we are combining animationFrame$ with keysPressed$ and resize$, basically, what withLatestFrom does is
// on every animationFrame we will be getting the latest value emitted from keysPressed$ and resize$
// there's a catch, if keysPressed$ and resize$ haven't emitted any value, gameLoop$ wont be emitting any value as well
// so when we start our application we wont see any paddles and the ball until we press one of the keys
// as for the resize$ because it's a BehaviorSubject it has an initial value
// thhe last argument for withLatestFrom is a function that will be getting the frame argument from animationFrame$
// the keysPressed from the keysPressed$ observable and the resize from the resize$ observable
const gameLoop$ = animationFrame$.withLatestFrom(
  keysPressed$,
  resize$,
  (frame, keysPressed, resize) => ({
    keysPressed,
    resize,
  })
)

// this is the logic responsible for checking if the windows is focused or not
// we merge the two observables, from the events focus and blur and pass them to the subject
// because de subject can be an observer or an observable we pass the subject as an argument to the merge
// and we subscirbe to it
const pauser = new Subject()
const focus$ = fromEvent(window, 'focus').map(() => false)
const blur$ = fromEvent(window, 'blur').map(() => true)
merge(blur$, focus$).subscribe(pauser)

// if the window is not focused, we return an empty observable
// if the window is focused we retunr the gameLoop$
const pausable$ = pauser.switchMap(paused => (paused ? never() : gameLoop$))

// we subscribe to the pausable$ which can either be a empty observable or a gameLoop$
pausable$.subscribe(({ keysPressed, resize }) => {
  update(keysPressed, resize)
  render(resize)
})
