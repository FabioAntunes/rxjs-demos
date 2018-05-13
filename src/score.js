import { BehaviorSubject } from 'rxjs/BehaviorSubject'

// We create two BehaviorSubjects with a initial value of 0
export const playerOneScore$ = new BehaviorSubject(0)
export const playerTwoScore$ = new BehaviorSubject(0)

// by calling this fuction we will increase the score of player one and notify all the subscribers
export const playerOneScored = () => {
  playerOneScore$.next(playerOneScore$.value + 1)
}
// same as above but for player two
export const playerTwoScored = () => {
  playerTwoScore$.next(playerTwoScore$.value + 1)
}
