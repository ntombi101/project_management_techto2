(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* --------------------------------------Dash board Functions-------------------------------------------------- */
const dashBoardWelcomeMsg = {}

// function to read cookies and extract user name
dashBoardWelcomeMsg.getCookieWelcomeMessage = function () {
  const allCookies = document.cookie
  const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
  const clientWelcomeMessage = splitCookies.welcomemessage

  return `${clientWelcomeMessage}`
}

exports.cookies = dashBoardWelcomeMsg

/* --------------------------------------View Meetings Page Functions-------------------------------------------------- */
const viewMeetingsPageFunctions = {}

// function to read cookies and extract user name
viewMeetingsPageFunctions.getUser = function () {
  const allCookies = document.cookie
  const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
  const usersname = splitCookies.user

  return `${usersname}`
}

exports.viewMeetingsPage = viewMeetingsPageFunctions

/* --------------------------------------Welcome Page Functions-------------------------------------------------- */

const welcomePageFunctions = {}

// Function to add zeros to single digit minutes & seconds
welcomePageFunctions.addZero = function (n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n
}

exports.welcomePage = welcomePageFunctions

/* ------------------------------------Study Group Page Functions--------------------------------------------------- */
const studyGroupPageFunctions = {}

// get created group name
studyGroupPageFunctions.getGroupNameCookie = function () {
  const allCookies = document.cookie
  const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
  const groupName = splitCookies.newGroupName

  return `${groupName}`
}

// get created group admin
studyGroupPageFunctions.getAdminNameCookie = function () {
  const allCookies = document.cookie
  const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
  const adminName = splitCookies.admin

  return `${adminName}`
}

// get day created
studyGroupPageFunctions.getDayCookie = function () {
  const allCookies = document.cookie
  const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
  const day = splitCookies.dayGroupCreated

  return `${day}`
}

// get month created
studyGroupPageFunctions.getMonthCookie = function () {
  const allCookies = document.cookie
  const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
  const month = splitCookies.monthGroupCreated

  return `${month}`
}

// get year created
studyGroupPageFunctions.getYearCookie = function () {
  const allCookies = document.cookie
  const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
  const year = splitCookies.yearGroupCreated

  return `${year}`
}

// get group admin name
studyGroupPageFunctions.setAdmin = function () {
  return this.getAdminNameCookie()
}

exports.studyGroupPage = studyGroupPageFunctions

},{}],2:[function(require,module,exports){
'use strict'
const functions = require('./Functions')

let requester
let requested

// get current user to display their meetings
const Currentuser = functions.viewMeetingsPage.getUser()
console.log(`current user is '${Currentuser}'`)

// fetch the meetingsRequests data
fetch('/user/api/list') // Returns a Promise for the GET request
  .then(function (response) {
    // Check if the request returned a valid code
    if (response.ok) return response.json() // Return the response parse as JSON if code is valid, →
    else { throw new Error('Failed to load database result: response code invalid!') }
  })
  .then(function (data) { // Display the JSON data appropriately
    // Retrieve the membersList outer html element
    // const classList = document.getElementById('membersList')
    // Iterate through all the results from db
    data.forEach(function (dbResult) {
    // check if the user is in the datbase
      console.log(dbResult.userName_ID)
      if (dbResult.userName_ID === Currentuser) {
        requester = dbResult.nameOfPersonRequesting
        requested = dbResult.userName_ID // get the name of the user who requested a meeting
      }
    })
  })
  .catch(function (e) { // Process error for request
    window.alert(e) // Displays a browser alert with the error message.
    // This will be the string thrown in line 7 IF the
    // response code is the reason for jumping to this
    // catch() function.
  })

// if a meeting was requested with the user, reflect the relevant data in the DOM elements
if (requested === Currentuser) {
// creating DOM elements
  const labelH = document.createElement('LABEL')
  labelH.innerHTML = `A face to face meeting request was sent by ${requester} would you like to accept it?`
  document.body.appendChild(labelH)
  const gender = ['Yes', 'No']
  gender.forEach((genederValue, i) => {
    const labelValue = document.createElement('label')
    labelValue.innerHTML = genederValue
    const inputValue = document.createElement('input')
    inputValue.type = 'radio'
    inputValue.name = 'meeting'
    inputValue.genederValue = i
    document.body.appendChild(labelValue)
    document.body.appendChild(inputValue)
  })
  const submitButton = document.createElement('INPUT')
  submitButton.setAttribute('type', 'button')
  submitButton.setAttribute('value', 'Submit')
  submitButton.setAttribute('id', 'SubmitM')
  document.body.appendChild(submitButton)
} else {
  const labelL = document.createElement('LABEL')
  labelL.innerHTML = 'you have no meeting requests'
  document.body.appendChild(labelL)
}

},{"./Functions":1}]},{},[2]);
