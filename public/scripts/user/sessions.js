// script that manages user sessions
'use strict'

let loggedInUser = null
let activeGroup = null

const setUser = function (user) {
  loggedInUser = user
}

const getUser = function () {
  return loggedInUser
}

const loggedOut = function () {
  loggedInUser = null
  activeGroup = null
}

const setActiveGroup = function (group) {
  activeGroup = group
}

const getActiveGroup = function () {
  return activeGroup
}

module.exports = {
  setUser: setUser,
  getUser: getUser,
  loggedOut: loggedOut,
  setActiveGroup: setActiveGroup,
  getActiveGroup: getActiveGroup
}
