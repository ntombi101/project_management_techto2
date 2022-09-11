const welcomeMessageCookie = require('./Functions')

// get the userName DOM element
const welcomeMessage_ = document.getElementById('welcomeMessage')
welcomeMessage_.innerHTML = `${welcomeMessageCookie.cookies.getCookieWelcomeMessage()}`

console.log(welcomeMessage_.nodeValue)
