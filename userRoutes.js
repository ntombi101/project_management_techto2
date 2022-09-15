'use strict'

const path = require('path')
const express = require('express')
const router = express.Router()
const db = require('./database/db')
const session = require('./public/scripts/user/sessions.js')
const sessions = require('./public/scripts/user/sessions.js')
const ArrivedSafeNotification = require('../2021-009-project/public/scripts/user/Functions.js')
const send = require('./public/scripts/user/emailNotifications.js')
const { getActiveGroup } = require('./public/scripts/user/sessions.js')

// had to create these global variables for logging purposes
const today = new Date()
const day = String(today.getDate()).padStart(2, '0')
const month = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
const year = today.getFullYear()

const hour = today.getHours()
const minutes = today.getMinutes()
const seconds = today.getSeconds()

const student = {
  username: 'Admin',
  name: 'Admin',
  surname: 'Admin',
  studentNumber: 'Admin'
}
const SESS_NAME = 'newSes'

// Redirect webpages which check if a user is authenticated
const redirectLogIn = (req, res, next) => {
  if (!req.session.loggedIn) {
    res.redirect('/login')
  } else {
    next()
  }
}

router.get('/CreatedProject', redirectLogIn, function (_req, res) {
  res.render('projectHomeTemplate', { errormessage: _req.flash('errormessage') })
})

router.get('/FaceToFace', redirectLogIn, function (req, res) {
  let today = new Date('2021-06-13')
  let dd = today.getDate()
  let mm = today.getMonth() + 1 // January is 0!
  const yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }

  today = yyyy + '-' + mm + '-' + dd
  res.render('facetoface', { minDate: today, errormessage: req.flash('errormessage') })
})

router.get('/online', redirectLogIn, function (req, res) {
  let today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1 // January is 0!
  const yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }

  today = yyyy + '-' + mm + '-' + dd
  res.render('online', { minDate: today, errormessage: req.flash('errormessage') })
})

router.get('/viewMeetings', redirectLogIn, function (_req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'viewMeetings.html'))
})

router.get('/members', redirectLogIn, function (_req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'members.html'))
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
      // perfoming a query
        .query(`INSERT INTO logActivities (initiatedBy, activity, inGroup, dateAndTime) VALUES ('${sessions.getUser()}', 'Viewed the members in the group','${sessions.getActiveGroup()}', '${year}-${month}-${day} ${hour}:${minutes}:${seconds}');`)
    })
  // Processing the response
    .then(result => {
      console.log('logged successfully')
    })
  // If there's an error, return that with some description
    .catch(err => {
      console.log(err)
    })
})

router.get('/manageCourses', redirectLogIn, function (_req, res) {
  res.render('courses', { errormessage: _req.flash('errormessage') })
})

router.get('/screeningform', redirectLogIn, function (_req, res) {
  res.render('Screeningform', { errormessage: _req.flash('errormessage') })
})

router.get('/addAddress', redirectLogIn, function (_req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'addAddress.html'))
})

router.get('/activities', redirectLogIn, function (_req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'activities.html'))
})

router.get('/resources', redirectLogIn, function (_req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'resources.html'))
})

router.get('/default', redirectLogIn, function (_req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'default.html'))
})

router.get('/homepage', redirectLogIn, function (req, res) {
  res.render('homepage', { errormessage: req.flash('errormessage') })
})

router.get('/ArrivedSafeNotification', redirectLogIn, function (_req, res) {
  res.render('ArrivedSafeNotification', { errormessage: _req.flash('errormessage') })
})

router.get('/logout', redirectLogIn, function (req, res) {
  req.session.destroy(err => {
    if (err) {
      res.redirect(req.baseUrl)
    }
    res.clearCookie(SESS_NAME)
    session.loggedOut()
    console.log(`Current user is ${session.getUser()}`)
    console.log(`Active group is ${session.getActiveGroup()}`)
    res.redirect('/login')
  })
})

router.get('/map', redirectLogIn, function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'map.html'))
})

router.get('/tracker', redirectLogIn, function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'tracker.html'))
})

// I query the database here then use fetch in members.js to return the results.
// See members.js to see how I fetched the db results.
// to do the same create a route similar like this that queries the db for you then
// use fetch to get the results into your js file.
router.get('/api/list', function (req, res) {
  // Make a query to the database

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query(`SELECT * FROM existingGroup WHERE groupName_ID = '${sessions.getActiveGroup()}'`)
    })
    // Processing the response
    .then(result => {
      res.send(result.recordset)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

router.get('/api/activities', function (req, res) {
  // Make a query to the database

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query(`SELECT * FROM logActivities WHERE inGroup = '${sessions.getActiveGroup()}'`)
    })
    // Processing the response
    .then(result => {
      res.send(result.recordset)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

router.get('/api/viewMeetings', function (req, res) {
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query('SELECT * from meetingRequests')
    })
    // Processing the response
    .then(result => {
      res.send(result.recordset)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

// display users meeting requests and accepted meetings
router.get('/meetings', redirectLogIn, function (req, res) {
  const userName = req.cookies.username
  const val = 1

  const dateOffset = (24 * 60 * 60 * 1000) * 5 // 5 days
  const myDate = new Date()
  myDate.setTime(myDate.getTime() - dateOffset)

  let yesterday = new Date(myDate)
  let dd1 = yesterday.getDate()
  let mm1 = yesterday.getMonth() + 1 // January is 0!
  const yyyy1 = yesterday.getFullYear()
  if (dd1 < 10) {
    dd1 = '0' + dd1
  }
  if (mm1 < 10) {
    mm1 = '0' + mm1
  }

  yesterday = yyyy1 + '-' + mm1 + '-' + dd1

  let today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1 // January is 0!
  const yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }

  today = yyyy + '-' + mm + '-' + dd

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query(`DELETE FROM meetingRequests WHERE date <= '${yesterday}'`)
    })
    // Processing the response
    .then(result => {
      db.pools
      // Run query
        .then((pool) => {
          return pool.request()
          // perfoming a query BETWEEN '${yesterday}' AND '${today}'
            .query(`SELECT * from meetingRequests WHERE userName_ID = '${userName}' AND date >= '${today}'`)
        })
      // Processing the response
        .then(result => {
          db.pools
          // Run query
            .then((pool) => {
              return pool.request()
              // perfoming a query
                .query(`SELECT * from meetingRequests WHERE meetingStatus = ${val} AND (userName_ID = '${userName}' OR nameOfPersonRequesting = '${userName}') AND date >= '${today}'`)
            })
          // Processing the response
            .then(result2 => {
              res.render('meetings', { requests: result.recordset, name: userName, accepted: result2.recordset })
            })
          // If there's an error, return that with some description
            .catch(err => {
              res.send({
                Error: err
              })
            })
        })
      // If there's an error, return that with some description
        .catch(err => {
          res.send({
            Error: err
          })
        })
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

// remove meeting from meetingRequests table if a user accepts it
// update appUser when a user accepts a meeting
router.get('/acceptMeeting/(:ID)', redirectLogIn, function (req, res) {
  const id = req.params.ID
  const value = 1
  console.log(id)

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query(`UPDATE meetingRequests SET meetingStatus = '${value}'
        WHERE ID = '${id}'`)
    })
    // Processing the response
    .then(result => {
      res.redirect(req.baseUrl + '/meetings')
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

// remove meeting from meetingRequests table if a user rejects it
router.get('/rejectMeeting/(:ID)', redirectLogIn, function (req, res) {
  const id = req.params.ID
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
      // perfoming a query
        .query(`DELETE FROM meetingRequests WHERE ID = '${id}'`)
    })
  // Processing the response
    .then(result => {
      res.redirect(req.baseUrl + '/meetings')
    })
  // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

// remove meeting from meetingRequests table if a user dismisses a covid notification
router.get('/dismissMeeting/(:ID)', redirectLogIn, function (req, res) {
  const id = req.params.ID
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
      // perfoming a query
        .query(`DELETE FROM meetingRequests WHERE ID = '${id}'`)
    })
  // Processing the response
    .then(result => {
      res.redirect(req.baseUrl + '/homepage')
    })
  // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

// get covid screening information
router.post('/api/screening', redirectLogIn, function (req, res) {
  const userName = req.cookies.username
  const screeningObject = {
    throat: req.body.soreThroat,
    fever: req.body.highFever,
    breath: req.body.shortBreath,
    taste: req.body.tasteLoss,
    nausea: req.body.vomiting,
    pain: req.body.bodyPain,
    fatigue: req.body.weakness,
    tested: req.body.testedPositive,
    contact: req.body.contactPositive
  }

  let covidStatus = 'Negative'
  if (screeningObject.throat === 'yes' || screeningObject.fever === 'yes' || screeningObject.breath === 'yes' || screeningObject.taste === 'yes' || screeningObject.nausea === 'yes' || screeningObject.pain === 'yes' || screeningObject.fatigue === 'yes' || screeningObject.tested === 'yes' || screeningObject.contact === 'yes') {
    covidStatus = 'Positive'
  }
  /// make a query to the database
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
        .query(`UPDATE appUsers SET CovidFlag = '${covidStatus}'
                WHERE userName = '${userName}'`)
    })
    // send back the result
    .then(_result => {
      // console.log('User\'s covid status is ', covidStatus)
      if ((screeningObject.throat !== 'yes' && screeningObject.throat !== 'no') || (screeningObject.fever !== 'yes' && screeningObject.fever !== 'no') || (screeningObject.breath !== 'yes' && screeningObject.breath !== 'no') || (screeningObject.taste !== 'yes' && screeningObject.taste !== 'no') || (screeningObject.nausea !== 'yes' && screeningObject.nausea !== 'no') || (screeningObject.pain !== 'yes' && screeningObject.pain !== 'no') || (screeningObject.fatigue !== 'yes' && screeningObject.fatigue !== 'no') || (screeningObject.tested !== 'yes' && screeningObject.tested !== 'no') || (screeningObject.contact !== 'yes' && screeningObject.contact !== 'no')) {
        req.flash('errormessage', 'Please fill out all fields')
        res.redirect(req.baseUrl + '/screeningform')
      } else if (covidStatus === 'Positive') {
        req.flash('errormessage', 'You have failed the COVID screening')
        res.redirect(req.baseUrl + '/CreatedGroup')
      } else {
        res.redirect(req.baseUrl + '/FaceToFace')
      }
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

// get address information
router.post('/api/address', redirectLogIn, function (req, res) {
  const userName = req.cookies.username
  const AddressObject = {
    address: req.body.address,
    city: req.body.city,
    postalCode: req.body.postalCode
  }
  /// make a query to the database
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
        .query(`UPDATE appUsers SET Adress = '${AddressObject.address}', City = '${AddressObject.city}', PostalCode = '${AddressObject.postalCode}'
       WHERE userName = '${userName}'`)
    })
    // send back the result
    .then(_result => {
      console.log('User\'s address is ', AddressObject.address, ' ', AddressObject.city, ' ', AddressObject.postalCode)
      res.redirect(req.baseUrl + '/homepage')
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

// Set up a face to face meeting
router.post('/api/facetoface', redirectLogIn, function (req, res) {
  const groupmember = req.body.groupMember
  const date = req.body.date1
  const time = req.body.time1
  let membersGroup
  const userName = req.cookies.username
  const usersGroup = req.cookies.newGroupName
  // make a query

  db.pools
    .then((pool) => {
      return pool.request()
      // .query('SELECT * FROM existingGroup')
        .query(`SELECT groupName_ID FROM existingGroup  WHERE userName_ID = '${groupmember}'`)
    })
    .then(result => {
      let index1
      for (index1 in result.recordset) {
        membersGroup = result.recordset[index1].groupName_ID
        console.log(membersGroup)
        if (membersGroup === usersGroup) {
          break
        }
      }

      if (membersGroup !== usersGroup) {
        req.flash('errormessage', 'user is not a group member')
        res.redirect(req.baseUrl + '/facetoface')
      } else {
        db.pools
          .then((pool) => {
            return pool.request()
              // .query('SELECT * FROM meetingRequests')
              .query(`INSERT INTO meetingRequests (userName_ID, groupName_ID, nameOfPersonRequesting, TypeOfMeeting, date, time) VALUES ('${groupmember}', '${membersGroup}', '${userName}', 'face to face', '${date}', '${time}')`)
          })
          .then(result => {

          })
        // If there's an error, return that with some description
          .catch(err => {
            res.send({
              Error: err
            })
          })

        res.redirect(req.baseUrl + '/CreatedGroup')
      }
    })
  // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

// Set up an online meeting
router.post('/api/online', redirectLogIn, function (req, res) {
  const groupmember = req.body.groupMember
  const date = req.body.date2
  const time = req.body.time2
  let membersGroup
  const userName = req.cookies.username
  const usersGroup = req.cookies.newGroupName
  // make a query

  db.pools
    .then((pool) => {
      return pool.request()
      // .query('SELECT * FROM existingGroup')
        .query(`SELECT groupName_ID FROM existingGroup  WHERE userName_ID = '${groupmember}'`)
    })
    .then(result => {
      let index1
      for (index1 in result.recordset) {
        membersGroup = result.recordset[index1].groupName_ID
        console.log(membersGroup)
        if (membersGroup === usersGroup) {
          break
        }
      }

      if (membersGroup !== usersGroup) {
        req.flash('errormessage', 'user is not a group member')
        res.redirect(req.baseUrl + '/online')
      } else {
        db.pools
          .then((pool) => {
            return pool.request()
              // .query('SELECT * FROM meetingRequests')
              .query(`INSERT INTO meetingRequests (userName_ID, groupName_ID, nameOfPersonRequesting, TypeOfMeeting, date, time) VALUES ('${groupmember}', '${membersGroup}', '${userName}', 'online', '${date}', '${time}')`)
          })
          .then(result => {
          //  console.log(result)
          })
        // If there's an error, return that with some description
          .catch(err => {
            res.send({
              Error: err
            })
          })

        res.redirect(req.baseUrl + '/CreatedGroup')
      }
    })
  // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

// send arrived safe notifications
router.post('/api/ArrivedNotifications', redirectLogIn, function (req, res) {
  // join meeting request table and appUser table
  const groupName_ = req.body.groupName
  const userName_ = req.cookies.username

  db.pools
    .then((pool) => {
      return pool.request()
        .query('SELECT * FROM createdGroup')
    })
    .then(result => {
      if (ArrivedSafeNotification.groupLogic.groupExistsInCreatedGroup(result.recordset, groupName_)) {
        db.pools
          .then((pool) => {
            return pool.request()
              .query(`SELECT m.userName_ID, m.groupName_ID, m.nameOfPersonRequesting, m.TypeOfMeeting, m.date, m.time, m.meetingStatus, appUsers.email FROM meetingrequests AS m JOIN appUser ON m.userName_ID = appUsers.userName WHERE groupName_ID = '${groupName_}'`)
          })
        // send back the result
          .then(_result => {
            const meetings = []
            ArrivedSafeNotification.coursesLogic.copyArray(meetings, _result.recordset)
            let i
            let emailsSent
            for (i = 0; i < meetings.length; i++) {
              if (meetings[i].TypeOfMeeting === 'face to face') {
                const today = new Date()
                const meetingDate = ArrivedSafeNotification.arrivedSafeLogic.splitDate(meetings[i].date)
                const year = parseInt(meetingDate[0])
                const month = parseInt(meetingDate[1])
                const day = parseInt(meetingDate[2])

                if (ArrivedSafeNotification.arrivedSafeLogic.TodaysDate(today, year, month, day)) {
                  const meetingTime = ArrivedSafeNotification.arrivedSafeLogic.splitTime(meetings[i].time)
                  const hour = parseInt(meetingTime[0])
                  const min = parseInt(meetingTime[1])

                  if (ArrivedSafeNotification.arrivedSafeLogic.pastTime(today, hour, min)) {
                    if (meetings[i].meetingStatus === true) {
                      console.log('sending email')
                      send.arrivedHomeSafe(meetings[i].email, meetings[i].userName_ID, groupName_, userName_)
                      emailsSent = true
                    }
                  } else {
                    req.flash('errormessage', 'This meeting is yet to occur later today.')
                    res.redirect(req.baseUrl + '/ArrivedSafeNotification')
                  }
                } else {
                  req.flash('errormessage', 'You cannot send arrived safe Notifications for meetings that have not happened or are in the past by more than one day.')
                  res.redirect(req.baseUrl + '/ArrivedSafeNotification')
                }
              }
            }
            if (emailsSent) {
              res.redirect(req.baseUrl + '/meetings')
            }
          })
      } else {
        req.flash('errormessage', 'This group does not exist. Please enter a valid group')
        res.redirect(req.baseUrl + '/ArrivedSafeNotification')
      }
    })
})

// Meting Destination
router.post('/api/destination', redirectLogIn, function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT AVG(latitude) as 'avgLatitude' FROM meetingRequests
                 WHERE groupName_ID = '${session.getActiveGroup()}' AND meetingStatus = '${1}' 
                 AND TypeOfMeeting = '${'face to face'}'`)
    })
    .then(result => {
      if (result.recordset[0].avgLatitude === null) {
        console.log('you do not have any meetings')
        res.redirect(req.baseUrl + '/homepage')
      } else {
        db.pools
          .then((pool) => {
            return pool.request()
              .query(`SELECT AVG (longitude) as 'avgLongitude' FROM meetingRequests
                      WHERE groupName_ID = '${session.getActiveGroup()}' AND meetingStatus = '${1}'
                      AND TypeOfMeeting = '${'face to face'}'`)
          })
          .then(result2 => {
            console.log(session.getActiveGroup(), 'group', 'meeting destination {', result.recordset[0], ',', result2.recordset[0], '}')
            res.render('map', { latitude: result.recordset, longitude: result2.recordset })
          })
      }
    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/api/viewLatitude', function (req, res) {
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query(`SELECT AVG(latitude) as 'avgLatitude' FROM meetingRequests
        WHERE groupName_ID = '${session.getActiveGroup()}' AND meetingStatus = '${1}' 
        AND TypeOfMeeting = '${'face to face'}'`)
    })
    // Processing the response
    .then(result => {
      res.send(result.recordset)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

router.get('/api/viewLongitude', function (req, res) {
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query(`SELECT AVG (longitude) as 'avgLongitude' FROM meetingRequests
                WHERE groupName_ID = '${session.getActiveGroup()}' AND meetingStatus = '${1}'
                AND TypeOfMeeting = '${'face to face'}'`)
    })
    // Processing the response
    .then(result => {
      res.send(result.recordset)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

module.exports = {
  router,
  student
}
