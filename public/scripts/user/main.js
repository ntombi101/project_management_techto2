'use strict'

// Setting welcome page Background
function setBackground () {
  document.body.style.backgroundImage = "url('cdn/images/books.jpg')"
}
setBackground()

// manipulating DOM Elements
const time_ = document.getElementById('time')

const functions = require('./Functions')

// This function is called within itself to update the time every second
function showTime () {
  const today = new Date()
  const hour = today.getHours()
  const min = today.getMinutes()
  const sec = today.getSeconds()

  time_.innerHTML = `${hour} <span>:<span>${functions.welcomePage.addZero(min)}<span>:<span>${functions.welcomePage.addZero(sec)}`
  setTimeout(showTime, 1000)
}
showTime()
