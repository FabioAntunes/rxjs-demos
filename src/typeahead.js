import { fromEvent } from 'rxjs/observable/fromEvent'
import { of } from 'rxjs/observable/of'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/debounceTime'

const input = document.createElement('input')
const list = document.createElement('div')
document.body.appendChild(input)
document.body.appendChild(list)
const names = [
  'Pedro',
  'Joe',
  'John',
  'Anna',
  'Rita',
  'Fabio',
  'Joao',
  'Jaime',
  'Telma',
  'Maria',
]

list.innerHTML = names.join('<br>')

// fake a return from the api with a 100ms delay
const fakeApi = val =>
  of(names.filter(n => n.toLowerCase().includes(val.toLowerCase()))).delay(100)

// for every keyup, map to current input value
// we will debounce for 250ms, so we discard emitted values that take less than the specified time between output
const debouncedInput = fromEvent(input, 'keyup')
  .map(i => i.currentTarget.value)
  .debounceTime(250)

// we want to map every debounced input to API call
debouncedInput.switchMap(val => fakeApi(val)).subscribe(filtered => {
  list.innerHTML = filtered.join('<br>')
})
