import { interval } from 'rxjs/observable/interval'
import 'rxjs/add/operator/map'

const clock = document.createElement('div')
document.body.appendChild(clock)

// create an observable that will emit every 1000ms/1s
// we then map each value to a new date, so every 1sec we get a new date value
// and then on the subscribe we format the date and add to the html element
interval(1000)
  .map(() => new Date())
  .subscribe(date => {
    clock.innerText = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  })
