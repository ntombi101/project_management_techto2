const moment = require('moment') // this dependency will give us access to the time
let dbMessages = null

function setExistingMessages (messages) {
  dbMessages = messages
}

function getExistingMessages () {
  return dbMessages
}

function formatMessage (username, text, dbtime, date) {
  return {
    username,
    text,
    dbtime,
    date,
    time: moment().format('h:mm a')
  }
}

module.exports = {
  setExistingMessages,
  getExistingMessages,
  formatMessage
}
