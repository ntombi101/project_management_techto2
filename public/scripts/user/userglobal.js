'use strict'
const user = require('../../../userRoutes')

const studentLog = {
  username: 'greg',
  name: 'greg',
  surname: 'greg',
  studentNumber: 1234
}

if (user.loggedin) {
  studentLog.username = user.student.username
  studentLog.name = user.student.name
  studentLog.surname = user.student.surname
  studentLog.studentNumber = user.student.studentNumber
}

const validUser = function (student) {
  studentLog.username = student.username
  studentLog.name = student.name
  studentLog.surname = student.surname
  studentLog.studentNumber = student.studentNumber

  if (student.username.length > 0 && student.name.length > 0 && student.surname.length > 0 && student.studentNumber > 0) { return true } else { return false }
}
module.exports = {
  studentLog,
  validUser: validUser
}
