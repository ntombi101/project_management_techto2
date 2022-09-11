'use strict'
const functions = require('./Functions')

// manipulating DOM elements
const admin_ = document.getElementById('groupAdminName')
const dateCreated_ = document.getElementById('dateCreated')
const groupWelcomemsg_ = document.getElementById('studyGroupWelcomeMessage1')

dateCreated_.innerHTML = `Date created:  ${functions.studyGroupPage.getYearCookie()} - ${functions.studyGroupPage.getMonthCookie()} - ${functions.studyGroupPage.getDayCookie()}`
groupWelcomemsg_.innerHTML = functions.studyGroupPage.getGroupNameCookie()
admin_.innerHTML = `Group is created by: ${functions.studyGroupPage.getAdminNameCookie()}`
