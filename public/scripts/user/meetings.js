'use strict'
const functions = require('./Functions')

let requester
let requested

// get current user to display their meetings
const Currentuser = functions.viewMeetingsPage.getUser()
console.log(`current user is '${Currentuser}'`)

// fetch the meetingsRequests data
fetch('/user/api/viewMeetings') // Returns a Promise for the GET request
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
