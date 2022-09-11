/* eslint-env jest */

// -------------------------------------------Welcome Page Tests-----------------------------------------------

// Testing the add zero function
const functions = require('../public/scripts/user/Functions.js')

const zeroAppended = functions.welcomePage.addZero(1)
test('Zeros appended/Added to single digit numbers', () => {
  expect(zeroAppended).toMatch(/01/)
})

const zeroNotAppended = functions.welcomePage.addZero(11)
test('Zeros not appended/Added to double digit numbers', () => {
  expect(zeroNotAppended).toMatch(/11/)
})

// ----------------------------------------Study group page Template Tests-------------------------------------

document.cookie = 'newGroupName= software'
const setCookie = functions.studyGroupPage.getGroupNameCookie()
test('set cookies are returned with their appropriate value', () => {
  expect(setCookie).toMatch(/software/)
})

document.cookie = 'newGroupName=  '
const emptyCookie = functions.studyGroupPage.getGroupNameCookie()
test('empty cookies are returned as empty', () => {
  expect(emptyCookie).toMatch('')
})

document.cookie = 'admin= Oratile'
const adminName = functions.studyGroupPage.getAdminNameCookie()
test('Group admin name is succesfully set', () => {
  expect(adminName).toMatch(/Oratile/)
})

document.cookie = 'dayGroupCreated= 05'
const dayCookie = functions.studyGroupPage.getDayCookie()
test('dayGroupCreated cookie is succesfully set', () => {
  expect(dayCookie).toMatch(/05/)
})

document.cookie = 'monthGroupCreated= 12'
const monthCookie = functions.studyGroupPage.getMonthCookie()
test('monthGroupCreated cookie is succesfully set', () => {
  expect(monthCookie).toMatch(/12/)
})

document.cookie = 'yearGroupCreated= 2021'
const yearCookie = functions.studyGroupPage.getYearCookie()
test('yearGroupCreated cookie is succesfully set', () => {
  expect(yearCookie).toMatch(/2021/)
})

document.cookie = 'welcomemessage= Welcome Paxton'
const welcomeMessageCookie = functions.cookies.getCookieWelcomeMessage()
test('welcome message cookie is succesfully set', () => {
  expect(welcomeMessageCookie).toMatch(/Welcome Paxton/)
})

// ----------------------------------------Sessions tests---------------------------
const sessions = require('../public/scripts/user/sessions.js')

const newUser = 'Thokozani'
test('The logged in user should be set', () => {
  sessions.setUser(newUser)
  expect(sessions.getUser()).toMatch(newUser)
})

test('When a user logs out the logged in user is set to Null', () => {
  sessions.loggedOut()
  expect(sessions.getUser()).toBe(null)
})

test('Test if Active Group is Set', () => {
  const activeGroup = 'Software Dev'
  sessions.setActiveGroup(activeGroup)
  expect(sessions.getActiveGroup()).toMatch(activeGroup)
})

// --------------------------------------------------Group Logic Tests----------------------------------------------

const checkGroup = require('../public/scripts/user/getGroupInfo.js')
const groups = require('../public/scripts/user/Functions.js')
const existingGroup = [
  { groupName_ID: 'Software III', userName_ID: 'Ammaarah' },
  { groupName_ID: 'Quantum I', userName_ID: 'Ntabiseng' },
  { groupName_ID: 'Software III', userName_ID: 'Thokozani' },
  { groupName_ID: 'Sociology', userName_ID: 'Oratile' }
]

test('check if user is a member of group', () => {
  const groupName = 'Software III'
  const userName = 'Ammaarah'
  expect(groups.groupLogic.userPartOfGroup(existingGroup, groupName, userName)).toEqual(true)
})

test('A user not belonging to a group inside existingGroup is picked up', () => {
  const groupName = 'Software III'
  const userName = 'Oratile'

  // Oratile is not part of software III group, so expect test to fail.
  expect(groups.groupLogic.userPartOfGroup(existingGroup, groupName, userName)).toEqual(false)
})

test('A user not belongining to any group is picked up', () => {
  const groupName = 'Software III'
  const userName = 'Pac'

  // Pac belongs to no group
  expect(groups.groupLogic.userPartOfGroup(existingGroup, groupName, userName)).toEqual(false)
})

test('check if a group belonging to existingGroup Table  is picked up', () => {
  const groupName = 'Software III'
  expect(groups.groupLogic.groupExistsInExistingGroup(existingGroup, groupName)).toBeTruthy()
})

test('A group not belonging to existingGroup is picked up with false return', () => {
  const groupName = 'Life Sciences'
  expect(groups.groupLogic.groupExistsInExistingGroup(existingGroup, groupName)).toBeFalsy()
})

const mathsGroup = [{ numMembers: 10 }]

test('reject a user when requesting to join a group that is full', () => {
  expect(checkGroup.hasReachedLimit(mathsGroup)).toEqual(true)
})

const networkGroup = [{ numMembers: 9 }]

test('allow a user when requesting to join a group that is not full', () => {
  expect(checkGroup.hasReachedLimit(networkGroup)).toEqual(false)
})

const softwareGroup = [{ numMembers: 0 }]

test('allow a user when requesting to join a group that has no members', () => {
  expect(checkGroup.hasReachedLimit(softwareGroup)).toEqual(false)
})

const createdGroup = [
  { groupName: 'Software III', dateCreated: '2021-05-04' },
  { groupName: 'Quantum I', dateCreated: '2021-05-04' },
  { groupName: 'Control II', userName_ID: '2021-05-04' }
]

test('A group belonging to createdGroup is found', () => {
  const groupName = 'Control II'
  expect(groups.groupLogic.groupExistsInCreatedGroup(createdGroup, groupName)).toBeTruthy()
})

test('A group not belonging to createdGroup table is picked up with false return', () => {
  const groupName = 'Technology'

  // Technology is not part of createdGroup array, so expect test to fail.
  expect(groups.groupLogic.groupExistsInCreatedGroup(createdGroup, groupName)).toBeFalsy()
})

test('An empty group table is reflected as empty', () => {
  const groupList = []
  expect(groups.groupLogic.isTableEmpty(groupList)).toBeTruthy()
})

test('A non-empty group table is reflected as not empty', () => {
  const existingGroupTable = [
    { groupName_ID: 'Software III', userName_ID: 'Ammaarah' },
    { groupName_ID: 'Quantum I', userName_ID: 'Ntabiseng' },
    { groupName_ID: 'Software III', userName_ID: 'Thokozani' },
    { groupName_ID: 'Sociology', userName_ID: 'Oratile' }
  ]
  // existingGroupTable is not empty.
  expect(groups.groupLogic.isTableEmpty(existingGroupTable)).toBeFalsy()
})

// Tests for group limit functionality
const usersExistingGroups = [{ numGroupsJoined: 10 }]

test('reject a user who has joined 10 groups when requesting to join a new group', () => {
  expect(checkGroup.joinedMaxGroups(usersExistingGroups)).toEqual(true)
})

const usersExistingGroup = [{ numGroupsJoined: 9 }]

test('allow a user who has joined less than 10 groups when requesting to join a new group', () => {
  expect(checkGroup.joinedMaxGroups(usersExistingGroup)).toEqual(false)
})

const usersCreatedGroups = [{ numGroupsCreated: 10 }]

test('reject a user who has joined 10 groups when requesting to join a new group', () => {
  expect(checkGroup.createdMaxGroups(usersCreatedGroups)).toEqual(true)
})

const usersCreatedGroup = [{ numGroupsCreated: 9 }]

test('reject a user who has joined 10 groups when requesting to join a new group', () => {
  expect(checkGroup.createdMaxGroups(usersCreatedGroup)).toEqual(false)
})

// ----------------------------------------Messages Tests------------------------
const format = require('../public/scripts/user/messages.js')

const student = {
  user: 'TK',
  msg: 'This is a test string',
  time: '09:00',
  date: '01/05/2021'
}
test('If function correctly captures the user, their message and time sent', () => {
  const check = format.formatMessage(student.user, student.msg, student.time, student.date)
  expect(check.text).toMatch(student.msg)
  expect(check.username).toMatch(student.user)
  expect(check.dbtime).toMatch(student.time)
  expect(check.date).toMatch(student.date)
})

test('If existing messages can be temporarily stored', () => {
  format.setExistingMessages(student)
  expect(format.getExistingMessages()).toEqual(student)
})

// -------------------------------------------Courses Logic------------------------------------------------------
const courses = require('../public/scripts/user/Functions.js')

test('course1 similar to course2 is captured', () => {
  const course1 = 'maths'
  const course2 = 'maths'
  const course3 = 'x'
  const course4 = 'xx'

  expect(courses.coursesLogic.noDuplicateCourses(course1, course2, course3, course4)).toBeFalsy()
})

test('course1 similar to course3 is captured', () => {
  const course1 = 'maths'
  const course2 = 'physics'
  const course3 = 'maths'
  const course4 = 'xx'

  expect(courses.coursesLogic.noDuplicateCourses(course1, course2, course3, course4)).toBeFalsy()
})

test('course1 similar to course4 is captured', () => {
  const course1 = 'maths'
  const course2 = 'physics'
  const course3 = 'geography'
  const course4 = 'maths'

  expect(courses.coursesLogic.noDuplicateCourses(course1, course2, course3, course4)).toBeFalsy()
})

test('course2 similar to course3 is captured', () => {
  const course1 = 'maths'
  const course2 = 'physics'
  const course3 = 'physics'
  const course4 = 'geo'

  expect(courses.coursesLogic.noDuplicateCourses(course1, course2, course3, course4)).toBeFalsy()
})

test('course2 similar to course4 is captured', () => {
  const course1 = 'maths'
  const course2 = 'physics'
  const course3 = 'geo'
  const course4 = 'physics'

  expect(courses.coursesLogic.noDuplicateCourses(course1, course2, course3, course4)).toBeFalsy()
})

test('course3 similar to course4 is captured', () => {
  const course1 = 'maths'
  const course2 = 'physics'
  const course3 = 'geo'
  const course4 = 'geo'

  expect(courses.coursesLogic.noDuplicateCourses(course1, course2, course3, course4)).toBeFalsy()
})

test('no Diplicate courses return true', () => {
  const course1 = 'maths'
  const course2 = 'physics'
  const course3 = 'geo'
  const course4 = 'L.O'

  expect(courses.coursesLogic.noDuplicateCourses(course1, course2, course3, course4)).toBeTruthy()
})

test('empty courses are reflected', () => {
  const course1 = ''
  const course2 = 'physics'
  const course3 = 'geo'
  const course4 = 'L.O'

  expect(courses.coursesLogic.emptyCourseField(course1, course2, course3, course4)).toBeTruthy()
})

test('non acceptable course format is captured', () => {
  const course1 = ''
  const course2 = 'physics'
  const course3 = 'physics'
  const course4 = 'L.O'

  expect(courses.coursesLogic.acceptableFormat(course1, course2, course3, course4)).toBeFalsy()
})

test('Acceptable course format is accepted', () => {
  const course1 = 'maths'
  const course2 = 'Geo'
  const course3 = 'physics'
  const course4 = 'L.O'

  expect(courses.coursesLogic.acceptableFormat(course1, course2, course3, course4)).toBeTruthy()
})

test('a similar studyGroup between createdGrouptable and coursesTable is found', () => {
  const createdGroupTable = [
    { groupName: 'Software III', dateCreated: '2020-01-01', userName_ID: 'Pax100' },
    { groupName: 'L.0', dateCreated: '2020-01-01', userName_ID: 'TK' },
    { groupName: 'Geo', dateCreated: '2020-01-01', userName_ID: 'Nomvula' }
  ]
  const coursesTable = [
    { courseName: 'Software III', userName_ID: 'Pax100' },
    { courseName: 'Physics', userName_ID: 'TK' },
    { courseName: 'Control II', userName_ID: 'Nomvula' }
  ]

  const results = courses.coursesLogic.findAllCoursesInCreatedGroup(createdGroupTable, coursesTable)
  const size = results.length

  expect(size).toBe(1)
})

test('copy one array into another', () => {
  const Array1 = []
  const Array2 = [1, 2, 3]

  courses.coursesLogic.copyArray(Array1, Array2)
  expect(Array1.length).toBe(3)
})

test('Sucesfully copy one array into another', () => {
  const Array1 = []
  const Array2 = [1, 2, 3]

  courses.coursesLogic.copyArray(Array1, Array2)
  expect(courses.coursesLogic.twoArrayEqual(Array1, Array2)).toBeTruthy()
})

test('If course is already recommended to user, return true', () => {
  const groupName = 'Data'
  const userName = 'Pax100'
  const recommendationList = [
    { studyGroup: 'Data', userName_ID: 'Pax100' },
    { studyGroup: 'Networks', userName_ID: 'Pax100' }
  ]

  expect(groups.groupLogic.userPartOfRecommendation(recommendationList, groupName, userName)).toBeTruthy()
})

test('If course is not recommended to user, return false', () => {
  const groupName = 'biology'
  const userName = 'Pax100'
  const recommendationList = [
    { studyGroup: 'Data', userName_ID: 'Pax100' },
    { studyGroup: 'Networks', userName_ID: 'Pax100' }
  ]

  expect(groups.groupLogic.userPartOfRecommendation(recommendationList, groupName, userName)).toBeFalsy()
})

// ----------------------------Voting Tests------------------------------------

test('InviteMember Function Returns true when number of Yes votes are above 50% of total votes', () => {
  const votes = [
    {
      groupName_ID: 'Networks',
      userName_ID: 'TK',
      acceptMember: 'Yes'
    },
    {
      groupName_ID: 'Networks',
      userName_ID: 'Paxton',
      acceptMember: 'Yes'
    },
    {
      groupName_ID: 'Networks',
      userName_ID: 'Florance',
      acceptMember: 'No'
    }
  ]

  expect(groups.voteCount.inviteNumberOfYes(votes, 'Networks')).toBeTruthy()
})

test('kickMember Function Returns true when number of Yes votes are above 50% of total votes', () => {
  const votes = [
    {
      groupName_ID: 'Networks',
      userName_ID: 'TK',
      kickMember: 'Yes'
    },
    {
      groupName_ID: 'Networks',
      userName_ID: 'Paxton',
      kickMember: 'Yes'
    },
    {
      groupName_ID: 'Networks',
      userName_ID: 'Florance',
      kickMember: 'No'
    }
  ]
  expect(groups.voteCount.kickNumberOfYes(votes, 'Networks')).toBeTruthy()
})

test('inviteMember Function Returns false when number of Yes votes are below 50% of total votes', () => {
  const votes = [
    {
      groupName_ID: 'Networks',
      userName_ID: 'TK',
      acceptMember: 'No'
    },
    {
      groupName_ID: 'Networks',
      userName_ID: 'Paxton',
      acceptMember: 'Yes'
    },
    {
      groupName_ID: 'Networks',
      userName_ID: 'Florance',
      acceptMember: 'No'
    }
  ]

  expect(groups.voteCount.inviteNumberOfYes(votes, 'Networks')).toBeFalsy()
})

test('inviteMember Function Returns false when number of Yes votes are below 50% of total votes', () => {
  const votes = [
    {
      groupName_ID: 'Networks',
      userName_ID: 'TK',
      kickMember: 'No'
    },
    {
      groupName_ID: 'Networks',
      userName_ID: 'Paxton',
      kickMember: 'Yes'
    },
    {
      groupName_ID: 'Networks',
      userName_ID: 'Florance',
      kickMember: 'No'
    }
  ]

  expect(groups.voteCount.kickNumberOfYes(votes, 'Networks')).toBeFalsy()
})

// -----------------------------ArrivedSafe Notification Tests----------------------------------------
const ArrivedSafeNotification = require('../public/scripts/user/Functions.js')

test('Split date array has the right year returned', () => {
  const stringDate = '2021-06-21'
  const dateArray = ArrivedSafeNotification.arrivedSafeLogic.splitDate(stringDate)
  expect(dateArray[0]).toMatch(/2021/)
})

test('Split date array has the right month returned', () => {
  const stringDate = '2021-06-21'
  const dateArray = ArrivedSafeNotification.arrivedSafeLogic.splitDate(stringDate)
  expect(dateArray[1]).toMatch(/06/)
})

test('Split date array has the right day returned', () => {
  const stringDate = '2021-06-21'
  const dateArray = ArrivedSafeNotification.arrivedSafeLogic.splitDate(stringDate)
  expect(dateArray[2]).toMatch(/21/)
})

test('Split time array has the right hours returned', () => {
  const stringTime = '15:59'
  const dateArray = ArrivedSafeNotification.arrivedSafeLogic.splitTime(stringTime)
  expect(dateArray[0]).toMatch(/15/)
})

test('Split time array has the right minutes returned', () => {
  const stringTime = '15:59'
  const dateArray = ArrivedSafeNotification.arrivedSafeLogic.splitTime(stringTime)
  expect(dateArray[1]).toMatch(/59/)
})
// ----------------------------Another js file's tests go below here------------------------------------
