'use strict'
const socket = io() // ignore this warning io is defined and it works its a problem with linting.
// const chatGroupNameCookie = require('./Functions')
const chatMessages = document.querySelector('.chat-messages')

// Message from server
socket.on('message', message => {
  outputMessage(message)

  // Scroll down automatically
  chatMessages.scrollTop = chatMessages.scrollHeight
})

const chatForm = document.getElementById('chat-form')

// Msessage submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault() // prevents submit default which inputs to file

  // get message text
  const msg = e.target.elements.msg.value

  // emit message to server
  socket.emit('chatMessage', msg)

  // Clear input
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

/// const room = document.getElementById('room-name')
// room.innerHTML = chatGroupNameCookie.studyGroupPage.getGroupNameCookie()

fetch('/user/api/list') // Returns a Promise for the GET request
  .then(function (response) {
    // Check if the request returned a valid code
    if (response.ok) return response.json() // Return the response parse as JSON if code is valid, →
    else { throw new Error('Failed to load database result: response code invalid!') }
  })
  .then(function (data) { // Display the JSON data appropriately
    const room = document.getElementById('room-name')
    room.innerHTML = data[0].groupName_ID
    const groupMembers = document.getElementById('users')
    console.log(data)
    // Iterate through all the results from db
    data.forEach(function (dbResult) {
    // Create a new list entry
      const li = document.createElement('LI')
      const liText = document.createTextNode(dbResult.userName_ID)

      // Append list text to list item and list item to list
      li.appendChild(liText)
      groupMembers.appendChild(li)
    })
  })
  .catch(function (e) { // Process error for request
    window.alert(e) // Displays a browser alert with the error message.
    // This will be the string thrown in line 7 IF the
    // response code is the reason for jumping to this
    // catch() function.
  })

// output message to DOM
function outputMessage (message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username} <span>${message.dbtime} ${message.date} </span></p>
  <p class="text">
    ${message.text}
  </p>`
  document.querySelector('.chat-messages').appendChild(div)
}
