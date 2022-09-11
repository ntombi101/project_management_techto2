(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* --------------------------------------Dash board Functions-------------------------------------------------- */

const dashBoardWelcomeMsg = {}

// function to read cookies and extract user name
dashBoardWelcomeMsg.getCookieUserName = function () {
  const allCookies = document.cookie
  const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
  const clientUserName = splitCookies.username

  return `${clientUserName}`
}

exports.cookies = dashBoardWelcomeMsg

/* --------------------------------------Welcome Page Functions-------------------------------------------------- */

const welcomePageFunctions = {}

// Function to add zeros to single digit minutes & seconds
welcomePageFunctions.addZero = function (n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n
}

exports.welcomePage = welcomePageFunctions

/* ------------------------------------Study Group Page Functions--------------------------------------------------- */
const studyGroupPageFunctions = {}

// Function to get group admin name
studyGroupPageFunctions.setAdmin = function (groupName) {
  // In future this name will be pulled down from the data base using the passed group name
  return 'Florance'
}

studyGroupPageFunctions.getNumberOfPeople = function (groupName) {
  // In future this number will be pulled down from the data base using the passed group name
  return 2
}

exports.studyGroupPage = studyGroupPageFunctions

},{}],2:[function(require,module,exports){
'use strict'

// Setting welcome page Background
function setBackground () {
  document.body.style.backgroundImage = "url('cdn/images/rhombus.jpg')"
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

},{"./Functions":1}]},{},[2]);
