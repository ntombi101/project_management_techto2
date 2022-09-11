'use strict'

// I use fetch to get the results from the database from userRoutes
// for your own use you can copy everything as is and change the necessary parts for you functionality

// ignore the fetch is not defined problem (fetch is defined and it works)
fetch('/user/api/list') // Returns a Promise for the GET request
  .then(function (response) {
    // Check if the request returned a valid code
    if (response.ok) return response.json() // Return the response parse as JSON if code is valid, →
    else { throw new Error('Failed to load database result: response code invalid!') }
  })
  .then(function (data) { // Display the JSON data appropriately
    // Retrieve the membersList outer html element
    const classList = document.getElementById('membersList')
    console.log(data)
    // Iterate through all the results from db
    data.forEach(function (dbResult) {
    // Create a new list entry
      const li = document.createElement('LI')
      const liText = document.createTextNode(dbResult.userName_ID)

      // Append list text to list item and list item to list
      li.appendChild(liText)
      classList.appendChild(li)
    })
  })
  .catch(function (e) { // Process error for request
    window.alert(e) // Displays a browser alert with the error message.
    // This will be the string thrown in line 7 IF the
    // response code is the reason for jumping to this
    // catch() function.
  })

fetch('/groups/api/viewRating')
  .then(function (response) {
    if (response.ok) return response.json()
    else { throw new Error('Failed to load rating database result: response code invalid!') }
  })
  .then(function (data) {
    // const classList = document.getElementById('membersList')
    // console.log(data)

    data.forEach(function (dbResult) {
      const ul = document.getElementById('membersList')
      const items = ul.getElementsByTagName('li')

      for (let i = 0; i < items.length; ++i) {
        if (items[i].innerText == dbResult.username) {
          const space = document.createTextNode(' ')
          const text = document.createTextNode(dbResult.rating)
          items[i].appendChild(space)
          items[i].appendChild(text)
        }
      }
    })
  })
  .catch(function (e) {
    window.alert(e)
  })
