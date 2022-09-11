(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const welcomePageUserName = {}

welcomePageUserName.setUserName = function () {
  // Save the entered username as a cookie to greet any user in their saved userName.
  const userName = 'Oratile100'
  document.cookie = `username= ${userName}; expires = Fri, 2 July 2021 12:00:00 UTC;`
}

// function to read cookies and extract user name
welcomePageUserName.getCookieUserName = function () {
  welcomePageUserName.setUserName()

  const allCookies = document.cookie
  const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
  const clientUserName = splitCookies.username

  return `${clientUserName}`
}

exports.cookies = welcomePageUserName

},{}],2:[function(require,module,exports){
'use strict'

/* --------------------------------------------getting user name to put on welcome page---------------------- */
const userNameCookie = require('./Functions')

// get the userName DOM element
const userName_ = document.getElementById('userName')
userName_.innerHTML = `${userNameCookie.cookies.getCookieUserName()}`

},{"./Functions":1}]},{},[2]);
