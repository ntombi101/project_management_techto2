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

exports.studyGroupPage = studyGroupPageFunctions

// -----------------------------------------Group Logic Functions------------------------------------------
const groupLogicFunctions = {}

// check if the group exists in existingGroup table
groupLogicFunctions.groupExistsInExistingGroup = function (grouplist, projectName) {
  const studygroup = grouplist.filter(studygroup => studygroup.projectName_ID === projectName)
  if (studygroup.length === 0) { return false } else return true
}

// check if the group exists in createdGroup table
groupLogicFunctions.groupExistsInCreatedGroup = function (grouplist, projectName) {
  const studygroup = grouplist.filter(studygroup => studygroup.projectName === projectName)
  if (studygroup.length === 0) { return false } else return true
}

// check if person is part of group in existing group
groupLogicFunctions.userPartOfExistingGroup = function (grouplist, employeeNumber) {
  const name = grouplist.filter(name => name.employeeNumber_ID === employeeNumber)
  if (name.length === 0) { return false } else return true
}

// see if user is part of any group at all
groupLogicFunctions.userPartOfGroup = function (grouplist, projectName, employeeNumber) {
  if (groupLogicFunctions.groupExistsInExistingGroup(grouplist, projectName) && (groupLogicFunctions.userPartOfExistingGroup(grouplist, employeeNumber))) {
    const found = grouplist.filter(found => (found.projectName_ID === projectName && found.employeeNumber_ID === employeeNumber))
    if (found.length === 0) { return false } else return true
  } else {
    return false
  }
}

groupLogicFunctions.userPartOfRecommendation = function (recommendationList, groupName, userName) {
  const found = recommendationList.filter(found => (found.studyGroup === groupName && found.userName_ID === userName))
  if (found.length === 0) { return false } else return true
}

// See if any table is empty
groupLogicFunctions.isTableEmpty = function (grouplist) {
  if (grouplist.length === 0) { return true } else return false
}

exports.groupLogic = groupLogicFunctions

// -----------------------------------------Count Votes Functions------------------------------------------
const countVotesFunctions = {}

countVotesFunctions.inviteNumberOfYes = function (grouplist, groupName) {
  const totalMembers = grouplist.filter(element => (element.groupName_ID === groupName))
  const totalLength = totalMembers.length
  const found = grouplist.filter(found => (found.groupName_ID === groupName && found.acceptMember === 'Yes'))
  console.log(`Total number of members = ${totalLength}`)
  console.log(`Number of yeses = ${found.length}`)
  if (found.length > (totalLength / 2)

  ) { return true } else return false
}

countVotesFunctions.kickNumberOfYes = function (grouplist, groupName) {
  const totalMembers = grouplist.filter(element => (element.groupName_ID === groupName))
  const totalLength = totalMembers.length
  const found = grouplist.filter(found => (found.groupName_ID === groupName && found.kickMember === 'Yes'))
  console.log(`Total number of members = ${totalLength}`)
  console.log(`Number of yeses = ${found.length}`)
  if (found.length > (totalLength / 2)

  ) { return true } else return false
}

exports.voteCount = countVotesFunctions

// ------------------------------------------Courses Functions--------------------------------------------------------

const courseFunctions = {}
// user does not enter the same course twice
courseFunctions.noDuplicateCourses = function (course1, course2, course3, course4) {
  if ((course1 === course2) || (course1 === course3) || (course1 === course4)) { return false } else if ((course2 === course3) || (course2 === course4)) {
    return false
  } else if ((course3 === course4)) {
    return false
  } else { return true }
}

courseFunctions.emptyCourseField = function (course1, course2, course3, course4) {
  if ((course1.length === 0) || (course2.length === 0) || (course3.length === 0) || (course4.length === 0)) {
    return true
  } else {
    return false
  }
}

courseFunctions.acceptableFormat = function (course1, course2, course3, course4) {
  if (courseFunctions.noDuplicateCourses(course1, course2, course3, course4) && (!courseFunctions.emptyCourseField(course1, course2, course3, course4))) {
    return true
  } else {
    return false
  }
}

courseFunctions.splitGroupNamesFromCreatedGrouptable = function (createdGroupTable) {
  let i
  const groupNamesColumn = []
  for (i = 0; i < createdGroupTable.length; i++) {
    groupNamesColumn[i] = createdGroupTable[i].groupName
  }

  return groupNamesColumn
}

courseFunctions.splitStudyGroupsFromRecommendationsTable = function (recommendationsTable) {
  let i
  const studyGroupsColumn = []
  for (i = 0; i < recommendationsTable.length; i++) {
    studyGroupsColumn[i] = recommendationsTable[i].studyGroup
  }
  return studyGroupsColumn
}

// Filter recommendable courses from recommendations table and createdGroup table
courseFunctions.findAllCoursesInCreatedGroup = function (createdGroupTable, coursesTable) {
  const newCreatedGroupTable = courseFunctions.splitGroupNamesFromCreatedGrouptable(createdGroupTable)
  const recommendable = coursesTable.filter(course => (newCreatedGroupTable.includes(course.courseName)))

  return recommendable
}

courseFunctions.copyArray = function (Array1, Array2) {
  let i = 0
  for (i = 0; i < Array2.length; i++) {
    Array1[i] = Array2[i]
  }
}

courseFunctions.twoArrayEqual = function (Array1, Array2) {
  if (JSON.stringify(Array1) === JSON.stringify(Array2)) {
    return true
  } else {
    return false
  }
}

exports.coursesLogic = courseFunctions

// -----------------------------------------Arrived Safe Notifications-----------------------------------------

// Function to split string date
const arrivedSafeFunctions = {}

arrivedSafeFunctions.splitDate = function (stringDate) {
  const dateArray = stringDate.split('-')
  return dateArray
}

arrivedSafeFunctions.splitTime = function (stringTime) {
  const timeArray = stringTime.split(':')
  return timeArray
}

arrivedSafeFunctions.TodaysDate = function (Date, year, month, day) {
  const todayYear = parseInt(Date.getFullYear())
  const todayMonth = parseInt(Date.getMonth() + 1)
  const todayDay = parseInt(Date.getDate())

  if ((todayYear === year) && (todayMonth === month) && (todayDay === day)) {
    return true
  } else {
    return false
  }
}

arrivedSafeFunctions.pastTime = function (Date, hour, min) {
  const todayHour = parseInt(Date.getHours())
  const todayMin = parseInt(Date.getMinutes())

  if ((hour < todayHour || hour === todayHour) && (min < todayMin || min === todayMin)) {
    return true
  } else {
    return false
  }
}

exports.arrivedSafeLogic = arrivedSafeFunctions
// -----------------------------------------Other functions go below ------------------------------------------
