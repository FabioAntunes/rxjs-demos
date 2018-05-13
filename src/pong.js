import { playerOneScored, playerTwoScored } from './score'
import { resize$ } from './window-resize'

// this code was adapted from here
// https://robots.thoughtbot.com/pong-clone-in-javascript

const canvas = document.createElement('canvas')
const width = resize$.value.width
const height = resize$.value.height
canvas.width = width
canvas.height = height
const context = canvas.getContext('2d')
const player = new Player()
const computer = new Computer()
const ball = new Ball(width / 2, height / 2)
context.fillStyle = 'black'
context.fillRect(0, 0, width, height)

export const render = function(resize) {
  canvas.width = resize.width
  canvas.height = resize.height
  context.fillStyle = 'black'
  context.fillRect(0, 0, resize.width, resize.height)
  player.render(resize)
  computer.render(resize)
  ball.render()
}

export const update = function(keysPressed, resize) {
  player.update(resize, keysPressed)
  computer.update(resize, ball)
  ball.update(resize, player.paddle, computer.paddle)
}

function Paddle(x, y, w, h) {
  this.x = x
  this.y = y
  this.width = w
  this.height = h
  this.x_speed = 0
  this.y_speed = 0
  this.max = width - this.width
}

Paddle.prototype.render = function(resize) {
  this.max = resize.width - this.width
  context.fillStyle = 'white'
  context.fillRect(this.x, this.y, this.width, this.height)
}

Paddle.prototype.move = function(resize, x, y) {
  this.x += x
  this.y += y
  this.x_speed = x
  this.y_speed = y
  if (this.x < 0) {
    this.x = 0
    this.x_speed = 0
  } else if (this.x + this.width > resize.width) {
    this.x = this.max
    this.x_speed = 0
  }
}

function Computer() {
  this.paddle = new Paddle(width / 2 - 25, 10, 50, 10)
}

Computer.prototype.render = function(resize) {
  this.paddle.render(resize)
}

Computer.prototype.update = function(resize, ball) {
  const x_pos = ball.x
  let diff = -(this.paddle.x + this.paddle.width / 2 - x_pos)
  if (diff < 0 && diff < -4) {
    diff = -5
  } else if (diff > 0 && diff > 4) {
    diff = 5
  }
  this.paddle.move(resize, diff, 0)
  if (this.paddle.x < 0) {
    this.paddle.x = 0
  } else if (this.paddle.x + this.paddle.width > resize.width) {
    this.paddle.x = resize.width - this.paddle.width
  }
}

function Player() {
  this.paddle = new Paddle(width / 2 - 25, height - 20, 50, 10)
}

Player.prototype.render = function(resize) {
  this.paddle.render(resize)
}

Player.prototype.update = function(resize, keysPressed) {
  if (keysPressed.w) {
    this.paddle.move(resize, -4, 0)
  } else if (keysPressed.e) {
    this.paddle.move(resize, 4, 0)
  }
}

function Ball(x, y) {
  this.x = x
  this.y = y
  this.x_speed = 0
  this.y_speed = 1
}

Ball.prototype.render = function() {
  context.beginPath()
  context.arc(this.x, this.y, 5, 2 * Math.PI, false)
  context.fillStyle = 'white'
  context.fill()
}

Ball.prototype.update = function(resize, paddle1, paddle2) {
  this.x += this.x_speed
  this.y += this.y_speed
  const top_x = this.x - 5
  const top_y = this.y - 5
  const bottom_x = this.x + 5
  const bottom_y = this.y + 5

  if (this.x - 5 < 0) {
    this.x = 5
    this.x_speed = -this.x_speed
  } else if (this.x + 5 > resize.width) {
    this.x = resize.width - 5
    this.x_speed = -this.x_speed
  }

  if (this.y < 0) {
    playerOneScored()
  } else if (this.y > resize.height) {
    playerTwoScored()
  }

  if (this.y < 0 || this.y > resize.height) {
    this.x_speed = 0
    this.y_speed = 1
    this.x = resize.width / 2
    this.y = resize.height / 2
    return
  }

  if (top_y > height / 2) {
    if (
      top_y < paddle1.y + paddle1.height &&
      bottom_y > paddle1.y &&
      top_x < paddle1.x + paddle1.width &&
      bottom_x > paddle1.x
    ) {
      this.y_speed = -2
      this.x_speed += paddle1.x_speed / 2
      this.y += this.y_speed
    }
  } else {
    if (
      top_y < paddle2.y + paddle2.height &&
      bottom_y > paddle2.y &&
      top_x < paddle2.x + paddle2.width &&
      bottom_x > paddle2.x
    ) {
      this.y_speed = 2
      this.x_speed += paddle2.x_speed / 2
      this.y += this.y_speed
    }
  }
}

document.body.appendChild(canvas)
