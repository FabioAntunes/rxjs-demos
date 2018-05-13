import { fromEvent } from 'rxjs/observable/fromEvent'
import 'rxjs/add/operator/map'

// some really dumb function that maps a x and y into rgb colors
const rgb = (x, y) => {
  const { innerHeight, innerWidth } = window
  const { ceil } = Math
  const ratioX = innerWidth / 255
  const ratioY = innerHeight / 255

  const r = ceil(x / ratioX)
  const gb = ceil(y / ratioY)

  return `rgb(${r}, ${gb}, ${gb})`
}

// we subscribe to the mousemove event
// for each mousemove event we map the x and y to a color
// on the subscribe we change the background color on requestAnimationFrame
fromEvent(document, 'mousemove')
  .map(({ clientX, clientY }) => rgb(clientX, clientY))
  .subscribe(color => {
    requestAnimationFrame(() => {
      document.body.style.backgroundColor = color
    })
  })
