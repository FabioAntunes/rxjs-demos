import './engine'
import { playerOneScore$, playerTwoScore$ } from './score'

// just some DOM initialisation
const scoreOne = document.createElement('div')
scoreOne.id = 'score-one'
scoreOne.className = 'score'
const scoreTwo = document.createElement('div')
scoreTwo.id = 'score-two'
scoreTwo.className = 'score'
document.body.appendChild(scoreOne)
document.body.appendChild(scoreTwo)

// subscribe to the scores
playerOneScore$.subscribe(score => (scoreOne.innerText = score))
playerTwoScore$.subscribe(score => (scoreTwo.innerText = score))
