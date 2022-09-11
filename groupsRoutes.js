'use strict'

const path = require('path')
const express = require('express')
const router = express.Router()
const db = require('./database/db')
const groups = require('./public/scripts/user/Functions.js')
const send = require('./public/scripts/user/emailNotifications.js')
const checkGroup = require('./public/scripts/user/getGroupInfo.js')
const session = require('./public/scripts/user/sessions.js')
const Pusher = require('pusher')
const sessions = require('./public/scripts/user/sessions.js')

// had to create these global variables for logging purposes
const today = new Date()
const day = String(today.getDate()).padStart(2, '0')
const month = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
const year = today.getFullYear()

const hour = today.getHours()
const minutes = today.getMinutes()
const seconds = today.getSeconds()

const pusher = new Pusher({
  appId: '1211188',
  key: '2763653032c734525975',
  secret: '64d48d902ad5f5add61c',
  cluster: 'ap2',
  useTLS: true
})

const student = {
  username: 'Admin',
  name: 'Admin',
  surname: 'Admin',
  studentNumber: 'Admin'
}

const redirectLogIn = (req, res, next) => {
  if (!req.session.loggedIn) {
    res.redirect('/login')
  } else {
    next()
  }
}

router.get('/CreatedGroup', redirectLogIn, function (_req, res) {
  res.render('studygroupTemp', { errormessage: _req.flash('errormessage') })
})

router.get('/CreateGroup', redirectLogIn, function (_req, res) {
  res.render('createGroup', { errormessage: _req.flash('errormessage') })
})

router.get('/searchGroups', redirectLogIn, function (req, res) {
  res.render('searchGroup', { errormessage: req.flash('errormessage') })
})

router.get('/leaveGroup', redirectLogIn, function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'leaveGroup.html'))
})

router.get('/homepage', redirectLogIn, function (req, res) {
  const userName = req.cookies.username
  const val = 1
  const covidStatus = 'Positive'
  const type = 'face to face'

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
        .query(`SELECT * from meetingRequests WHERE meetingStatus = '${val}' AND TypeOfMeeting = '${type}' AND (userName_ID = '${userName}' OR nameOfPersonRequesting = '${userName}') AND date BETWEEN '${yesterday}' AND '${today}'`)
    })
    // Processing the response
    .then(result => {
      // console.log(result)
      db.pools
      // Run query
        .then((pool) => {
          return pool.request()
          // perfoming a query
            .query(`SELECT * from appUser WHERE CovidFlag = '${covidStatus}'`)
        })
      // Processing the response
        .then(result2 => {
          //  console.log(result2)
          res.render('homepage', { name: userName, accepted: result.recordset, covid: result2.recordset })
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

router.get('/vote', redirectLogIn, function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'vote.html'))
})

router.get('/kick', redirectLogIn, function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'kickVote.html'))
})

router.get('/joinGroup', redirectLogIn, function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'foundGroup.html'))
})

router.get('/group', redirectLogIn, function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'groups.html'))
})

router.get('/recommendations', redirectLogIn, function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'recommendations.html'))
})

router.get('/removeMember', redirectLogIn, function (req, res) {
  res.render('removeMember', { errormessage: req.flash('errormessage') })
})

router.get('/manageCourses', redirectLogIn, function (req, res) {
  res.render('courses', { errormessage: req.flash('errormessage') })
})

router.get('/rate', redirectLogIn, function (req, res) {
  res.render('ratings', { errormessage: req.flash('errormessage') })
})

router.get('/joinByInvite', redirectLogIn, function (req, res) {
  // res.sendFile(path.join(__dirname, 'views', 'user', 'joinByInvite.html'))
  res.render('joinByInvite', { errormessage: req.flash('errormessage') })
})

router.get('/api/viewRating', function (req, res) {
  // Make a query to the database

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query('SELECT * FROM userRating')
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

// rating
router.post('/api/rating', redirectLogIn, function (req, res) {
  console.log('entering the rate tings')
  const starVal = req.body.rate
  const username = req.body.unameRate
  let groupUser = 0
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT * FROM existingGroup WHERE groupName_ID = '${sessions.getActiveGroup()}'`)
    })
    .then(result => {
      const index1 = result.recordset.findIndex(function (elem) {
        return elem.userName_ID === username
      })

      if (index1 < 0) {
        groupUser = 1
      }
    })

  db.pools
  // query the database
    .then((pool) => {
      return pool.request()

      // get the information from the userRating table
        .query('SELECT * FROM userRating')
    })

    .then(result => {
      const index = result.recordset.findIndex(function (elem) {
        return elem.username === username
      })

      if (index >= 0 && groupUser === 0) {
        let one = result.recordset[index].oneStar
        let two = result.recordset[index].twoStar
        let three = result.recordset[index].threeStar
        let four = result.recordset[index].fourStar
        let five = result.recordset[index].fiveStar
        if (starVal === '5') { five += 1 } else if (starVal === '4') { four += 1 } else if (starVal === '3') { three += 1 } else if (starVal === '2') { two += 1 } else if (starVal === '1') { one += 1 }

        console.log(one, two, three, four, five)
        // final rating of user
        const rates = (5 * five + 4 * four + 3 * three + 2 * two + 1 * one) / (five + four + three + two + one)
        const fixedrates = rates.toFixed(2)

        db.pools
          .then((pool) => {
            return pool.request()
              .query(`UPDATE userRating SET rating = ${fixedrates}, fiveStar = ${five}, fourStar = ${four}, threeStar = ${three}, twoStar = ${two}, oneStar = ${one} WHERE username = '${username}'`)
          })

          .then(result1 => {
            console.log(`${username} rating: `, fixedrates)
            res.redirect(req.baseUrl + '/CreatedGroup')
          })
      } else if (groupUser === 1) {
        req.flash('errormessage', 'This user does not exist in this group!')
        res.redirect(req.baseUrl + '/rate')
      } else {
        db.pools
          .then((pool) => {
            return pool.request()
              .query(`INSERT INTO userRating (username,rating,fiveStar,fourStar,threeStar,twoStar,oneStar) VALUES ('${username}', NULL ,NULL,NULL,NULL,NULL,NULL)`)
          })
          .then(results => {
            if (starVal === '5') {
              db.pools
                .then((pool) => {
                  return pool.request()
                    .query(`UPDATE userRating SET rating = 5.00, fiveStar = 1  WHERE username = '${username}'`)
                })

                .then(results1 => {
                  console.log(`${username} rating: `, 5)
                  res.redirect(req.baseUrl + '/CreatedGroup')
                })
            } else if (starVal === '4') {
              db.pools
                .then((pool) => {
                  return pool.request()
                    .query(`UPDATE userRating SET rating = 4.00, foutStar = 1  WHERE username = '${username}'`)
                })

                .then(results1 => {
                  console.log(`${username} rating: `, 4)
                  res.redirect(req.baseUrl + '/CreatedGroup')
                })
            } else if (starVal === '3') {
              db.pools
                .then((pool) => {
                  return pool.request()
                    .query(`UPDATE userRating SET rating = 3.00, threeStar = 1  WHERE username = '${username}'`)
                })

                .then(results1 => {
                  console.log(`${username} rating: `, 3)
                  res.redirect(req.baseUrl + '/CreatedGroup')
                })
            } else if (starVal === '2') {
              db.pools
                .then((pool) => {
                  return pool.request()
                    .query(`UPDATE userRating SET rating = 2.00, twoStar = 1  WHERE username = '${username}'`)
                })

                .then(results1 => {
                  console.log(`${username} rating: `, 2)
                  res.redirect(req.baseUrl + '/CreatedGroup')
                })
            } else if (starVal === '1') {
              db.pools
                .then((pool) => {
                  return pool.request()
                    .query(`UPDATE userRating SET rating = 1.00, oneStar = 1  WHERE username = '${username}'`)
                })

                .then(results1 => {
                  console.log(`${username} rating: `, 1)
                  res.redirect(req.baseUrl + '/CreatedGroup')
                })
            }
          })
      }
    })
})

// voting
router.get('/api/vote', redirectLogIn, function (req, res) {
  // Make a query to the database
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
      // perfoming a query
        .query(`SELECT acceptMember FROM existingGroup WHERE groupName_ID = '${sessions.getActiveGroup()}'`)
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
// voting
router.get('/api/kick', redirectLogIn, function (req, res) {
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query(`SELECT kickMember FROM existingGroup WHERE groupName_ID = '${sessions.getActiveGroup()}'`)
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

router.get('/api/grouplist', function (req, res) {
  // Make a query to the database
  const user = req.cookies.username
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query(`SELECT * FROM existingGroup WHERE userName_ID = '${user}'`)
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

router.get('/api/recommendations', function (req, res) {
  const user = req.cookies.username

  // update recommendationsTable with changes that took place in created group
  db.pools
    .then((pool) => {
      return pool.request()
        .query('SELECT * FROM createdGroup')
    })
    .then(createdGroup => {
      db.pools
        .then((pool) => {
          return pool.request()
            .query(`SELECT * FROM courses WHERE userName_ID = '${user}'`)
        })
        .then(courses => {
          db.pools
            .then((pool) => {
              return pool.request()
                .query(`SELECT * FROM recommendations WHERE userName_ID = '${user}'`)
            })
            .then((recommendations) => {
              const createdGroupTable = []
              const coursesTable = []
              const recommendationsTable = []
              groups.coursesLogic.copyArray(createdGroupTable, createdGroup.recordset)
              groups.coursesLogic.copyArray(coursesTable, courses.recordset)
              groups.coursesLogic.copyArray(recommendationsTable, recommendations)

              // return all recommendable groups to a user based on whether they have been created.
              const recommend = groups.coursesLogic.findAllCoursesInCreatedGroup(createdGroupTable, coursesTable)

              // if similarities found proceed to check which of those studyGroups the user is already a part of
              if (recommend.length > 0) {
                let j
                for (j = 0; j < recommend.length; j++) {
                  const studyGroup = recommend[j].courseName
                  db.pools
                    .then((pool) => {
                      return pool.request()
                        .query(`SELECT * FROM existingGroup WHERE userName_ID= '${user}'`)
                    })
                    .then(existingGroup => {
                      // if the user is not part any of any of the similar found groups- add the found group into recommendation table
                      if (!groups.groupLogic.userPartOfGroup(existingGroup.recordset, studyGroup, user) && !groups.groupLogic.userPartOfRecommendation(recommendations.recordset, studyGroup, user)) {
                        db.pools
                          .then((pool) => {
                            return pool.request()
                            // add course name and user pair into recommendations database
                              .query(`INSERT INTO recommendations(studyGroup, userName_ID) VALUES ('${studyGroup}', '${user}')`)
                          })
                      }
                    })
                }
              }
            })
        })
    })

  // after the recommendation tables is updated post recommended table
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT * FROM recommendations WHERE userName_ID = '${user}'`)
    })
    .then(result => {
      res.send(result.recordset)
    })
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

router.post('/api/vote', redirectLogIn, function (req, res) {
  const theVote = req.body.vote
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()

        .query(`UPDATE existingGroup SET acceptMember = '${theVote}' WHERE userName_ID = '${sessions.getUser()}' AND groupName_ID = '${sessions.getActiveGroup()}'`)
    })
    // send back the result
    .then(result => {
      pusher.trigger('studycoordinator', 'member-vote', {
        points: 1,
        vote: theVote
      })

      return res.json({ success: true, message: 'Thank you for voting' })
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })

  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
      // perfoming a query
        .query(`INSERT INTO logActivities (initiatedBy, activity, inGroup, dateAndTime) VALUES ('${sessions.getUser()}', 'Voted in add member vote','${sessions.getActiveGroup()}', '${year}-${month}-${day} ${hour}:${minutes}:${seconds}');`)
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

router.post('/api/kick', redirectLogIn, function (req, res) {
  const theVote = req.body.vote
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()

        .query(`UPDATE existingGroup SET kickMember = '${theVote}' WHERE userName_ID = '${session.getUser()}' AND groupName_ID = '${sessions.getActiveGroup()}'`)
    })
  // send back the result
    .then(result => {
      pusher.trigger('studycoordinator', 'member-vote', {
        points: 1,
        vote: theVote
      })

      return res.json({ success: true, message: 'Thank you for voting' })
    })
  // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query(`INSERT INTO logActivities (initiatedBy, activity, inGroup, dateAndTime) VALUES ('${sessions.getUser()}', 'Voted in kick member vote','${sessions.getActiveGroup()}', '${year}-${month}-${day} ${hour}:${minutes}:${seconds}');`)
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

// enter group
router.post('/api/enterGroup', redirectLogIn, function (req, res) {
  const groupName = req.body.group
  sessions.setActiveGroup(groupName)
  console.log(`The active group you in: ${sessions.getActiveGroup()}`)
  console.log(`The group you have entered is: ${groupName}`)
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT * FROM createdGroup WHERE groupName = '${groupName}'`)
    })
    .then(result => {
      if (groups.groupLogic.groupExistsInCreatedGroup(result.recordset, groupName) === true) {
        const userName = result.recordset[0].userName_ID
        const day = String(result.recordset[0].dateCreated.getDate()).padStart(2, 0)
        const month = String(result.recordset[0].dateCreated.getMonth() + 1).padStart(2, 0)
        const year = result.recordset[0].dateCreated.getFullYear()

        res.cookie('admin', `${userName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('newGroupName', `${groupName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('dayGroupCreated', `${day}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('monthGroupCreated', `${month}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('yearGroupCreated', `${year}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.redirect(req.baseUrl + '/CreatedGroup')
      }
    })
})

// enter recommended group
router.post('/api/joinRecommendedGroup', redirectLogIn, function (req, res) {
  const groupName = req.body.group
  const user = req.cookies.username

  // delete all groups from recommendations that the user has joined and add the new course they are a part of to existingGroup.
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT * FROM existingGroup WHERE userName_ID = '${user}'`)
    })
    .then((existingGroup) => {
      if (!groups.groupLogic.userPartOfGroup(existingGroup.recordset, groupName, user)) {
        db.pools
          .then((pool) => {
            return pool.request()
              .query(`INSERT INTO existingGroup (groupName_ID, userName_ID) VALUES ( '${groupName}', '${user}')`)
          })
      }
    })

  db.pools
    .then((pool) => {
      return pool.request()
        .query(`DELETE FROM recommendations WHERE studyGroup = '${groupName}'`)
    })

  console.log(`The recommended group you have decided join is: ${groupName}`)
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT * FROM createdGroup WHERE groupName = '${groupName}'`)
    })
    .then(result => {
      if (groups.groupLogic.groupExistsInCreatedGroup(result.recordset, groupName) === true) {
        const userName = result.recordset[0].userName_ID
        const day = String(result.recordset[0].dateCreated.getDate()).padStart(2, 0)
        const month = String(result.recordset[0].dateCreated.getMonth() + 1).padStart(2, 0)
        const year = result.recordset[0].dateCreated.getFullYear()

        res.cookie('admin', `${userName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('newGroupName', `${groupName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('dayGroupCreated', `${day}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('monthGroupCreated', `${month}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('yearGroupCreated', `${year}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.redirect(req.baseUrl + '/CreatedGroup')
      }
    })
})

// join group by invite
router.post('/api/joinByInvite', redirectLogIn, function (req, res) {
  const invitee = req.body.inviteeName
  const groupName = req.cookies.newGroupName
  const inviter = req.cookies.username
  const reason = `${inviter}`
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
      // perfoming a query
        .query(`INSERT INTO logActivities (initiatedBy, activity, inGroup, dateAndTime) VALUES ('${sessions.getUser()}', 'Started vote to invite member ${invitee}','${sessions.getActiveGroup()}', '${year}-${month}-${day} ${hour}:${minutes}:${seconds}');`)
    })
  // Processing the response
    .then(result => {
      console.log('logged successfully')
    })
  // If there's an error, return that with some description
    .catch(err => {
      console.log(err)
    })

  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT existingGroup.userName_ID, appUser.email FROM existingGroup INNER JOIN appUser ON existingGroup.userName_ID = appUser.userName WHERE groupName_ID = '${sessions.getActiveGroup()}'`)
    })
    .then(result => {
      for (let index = 0; index < result.recordset.length; index++) {
        send.voteInitiated(result.recordset[index].email, result.recordset[index].userName_ID, groupName, invitee)
      }
    })

  // query number of groups user has joined
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT COUNT (userName_ID) as 'numGroupsJoined' FROM existingGroup WHERE userName_ID = '${invitee}'`)
    })
    .then(result => {
      if (checkGroup.joinedMaxGroups(result.recordset) === true) {
        req.flash('errormessage', 'Invalid Invitation.', invitee, 'is alreday a member of 10 study groups!')
        res.redirect(req.baseUrl + '/joinByInvite')
      } else {
        db.pools
          .then((pool) => {
            return pool.request()
              .query('SELECT * FROM existingGroup')
          })
          .then(result => {
          // if the invitee user is not part of the group in question, add them to the group
            if (!groups.groupLogic.userPartOfGroup(result.recordset, groupName, invitee) && groups.voteCount.inviteNumberOfYes(result.recordset, groupName)) {
              db.pools
                .then((pool) => {
                  return pool.request()
                    .query(`INSERT INTO existingGroup (groupName_ID, userName_ID) VALUES ( '${groupName}', '${invitee}')`)
                })

                .then(result => {
                  db.pools
                    .then((pool) => {
                      return pool.request()
                        .query(`UPDATE existingGroup SET acceptMember = 'null' WHERE groupName_ID = '${groupName}'`)
                    })
                    .catch(err => {
                      console.log(err)
                    })
                  res.redirect(req.baseUrl + '/CreatedGroup')
                })

              // make a query to notify them via email
              db.pools
                .then((pool) => {
                  return pool.request()
                    .query('SELECT * FROM appUser')
                })
                .then(result => {
                  const index = result.recordset.findIndex(function (elem) {
                    return elem.userName === invitee
                  })
                  if (index >= 0) {
                    send.invitedIntoGroup(result.recordset[index].email, result.recordset[index].userName, groupName, reason)
                  }
                })

            // else if invitee is already part of group. Redirect to study group homepage
            } else if (!groups.groupLogic.userPartOfGroup(result.recordset, groupName, invitee) && !groups.voteCount.inviteNumberOfYes(result.recordset, groupName)) {
              console.log('vote still in progress')
              req.flash('errormessage', 'vote still in progress')
              res.redirect(req.baseUrl + '/joinByInvite')
            } else {
              res.redirect(req.baseUrl + '/CreatedGroup')
            }
          })
      }
    })
})

// Join Group
router.post('/api/joinGroup', redirectLogIn, function (req, res) {
  const groupName = req.cookies.groupName
  const user = req.cookies.username
  if (req.body.joinGroupAnswer === 'yes') {
    // query number of groups user has joined
    db.pools
      .then((pool) => {
        return pool.request()
          .query(`SELECT COUNT (userName_ID) as 'numGroupsJoined' FROM existingGroup WHERE userName_ID = '${user}'`)
      })
      .then(result => {
        if (checkGroup.joinedMaxGroups(result.recordset) === true) {
          req.flash('errormessage', user, 'you can not join and create more than 10 study groups!')
          res.redirect(req.baseUrl + '/homepage')
        } else {
          console.log('numGroupsJoined', result.recordset[0].numGroupsJoined)
          // query the group limit
          db.pools
            .then((pool) => {
              return pool.request()
                .query(`SELECT COUNT (groupName_ID) as 'numMembers' FROM existingGroup WHERE groupName_ID = '${groupName}'`)
            })
            .then(result => {
              if (checkGroup.hasReachedLimit(result.recordset) === true) {
                req.flash('errormessage', 'This Group is Full !')
                res.redirect(req.baseUrl + '/searchGroups')
              } else {
                // check if the user is not part of group already
                db.pools
                  .then((pool) => {
                    return pool.request()
                      .query(`SELECT * FROM existingGroup WHERE groupName_ID = '${groupName}' AND userName_ID= '${user}'`)
                  })
                  .then(result => {
                    // if the user and searched for group are found in existing group- redirect to studyPageTemplate
                    if ((groups.groupLogic.groupExistsInExistingGroup(result.recordset, groupName)) && (groups.groupLogic.userPartOfExistingGroup(result.recordset, user))) {
                      if (result.recordset[0].groupName_ID === groupName & result.recordset[0].userName_ID === user) {
                        console.log('you are already a member of this group')
                        db.pools
                          .then((pool) => {
                            return pool.request()
                              .query(`SELECT * FROM createdGroup WHERE groupName = '${groupName}'`)
                          })
                          .then(result => {
                            if (groups.groupLogic.groupExistsInCreatedGroup(result.recordset, groupName) === true) {
                              const userName = result.recordset[0].userName_ID
                              const day = String(result.recordset[0].dateCreated.getDate()).padStart(2, 0)
                              const month = String(result.recordset[0].dateCreated.getMonth() + 1).padStart(2, 0)
                              const year = result.recordset[0].dateCreated.getFullYear()

                              res.cookie('admin', `${userName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
                              res.cookie('newGroupName', `${groupName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
                              res.cookie('dayGroupCreated', `${day}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
                              res.cookie('monthGroupCreated', `${month}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
                              res.cookie('yearGroupCreated', `${year}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
                              res.redirect(req.baseUrl + '/CreatedGroup')
                            } else {
                              // if the group is found in existing groups but not created group
                              res.send('This group doesnt exist in created Group Table')
                            }
                          })
                      }
                    } else {
                      // Else proceed to add user to existingGroups
                      db.pools
                        .then((pool) => {
                          return pool.request()
                            .query(`INSERT INTO existingGroup (groupName_ID, userName_ID) VALUES ( '${groupName}', '${user}')`)
                        })

                        .then(result => {
                          // Take back to homepage after joining a group
                          res.redirect(req.baseUrl + '/homepage')
                        })
                    }
                  })
              }
            })
        }
      })
      .catch(err => {
        res.send({
          Error: err
        })
      })
  } else {
    // if no entered to join group
    db.pools
      .then((pool) => {
        return pool.request()
          .query(`SELECT * FROM existingGroup WHERE groupName_ID = '${groupName}' AND userName_ID= '${user}'`)
      })
      .then(result => {
        if (!groups.groupLogic.userPartOfGroup(result.recordset, groupName, user)) {
          db.pools
            .then((pool) => {
              return pool.request()

                // add course name and user pair into courseNameAndAppUser database
                .query(`INSERT INTO recommendations(studyGroup, userName_ID) VALUES ('${groupName}', '${user}')`)
            })
        }
      })

    // Send back to homepage
    res.redirect(req.baseUrl + '/homepage')
  }
})

// Group Search
router.post('/api/searchGroups', redirectLogIn, function (req, res) {
  const groupName = req.body.searchingGroup
  console.log(`Searching for the following group ${groupName}`)

  // make a query
  db.pools
    .then((pool) => {
      return pool.request()
        .query('SELECT * FROM createdGroup WHERE groupName = \'' + groupName + '\'')
    })
    .then(result => {
      // Check if group name exists
      if (groups.groupLogic.groupExistsInCreatedGroup(result.recordset, groupName) === true) {
        res.cookie('groupName', `${groupName}`, { maxAge: 9000000000, httpOnly: false })
        res.redirect(req.baseUrl + '/joinGroup')
      } else {
        req.flash('errormessage', 'This Group Does Not Exist!')
        res.redirect(req.baseUrl + '/searchGroups')
      }
    })
})

// Create Group
router.post('/api/createGroup', redirectLogIn, function (req, res) {
  const groupName = req.body.groupName
  const userName = req.cookies.username

  const todayDate = new Date()
  const day = String(todayDate.getDate()).padStart(2, '0')
  const month = String(todayDate.getMonth() + 1).padStart(2, '0')
  const year = todayDate.getFullYear()
  // query number of groups user has joined
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT COUNT (userName_ID) as 'numGroupsJoined' FROM existingGroup WHERE userName_ID = '${userName}'`)
    })
    .then(result => {
      if (checkGroup.joinedMaxGroups(result.recordset) === true) {
        req.flash('errormessage', userName, 'you can not join and create more than 10 study groups!')
        res.redirect(req.baseUrl + '/homepage')
      } else {
        console.log('numGroupsJoined', result.recordset[0].numGroupsJoined)
        // query number of groups user has created
        db.pools
          .then((pool) => {
            return pool.request()
              .query(`SELECT COUNT (userName_ID) as 'numGroupsCreated' FROM createdGroup WHERE userName_ID = '${userName}'`)
          })
          .then(result => {
            if (checkGroup.createdMaxGroups(result.recordset) === true) {
              req.flash('errormessage', userName, 'you can not join and create more than 10 study groups!')
              res.redirect(req.baseUrl + '/homepage')
            }
          })
          .catch(err => {
            res.send({
              Error: err
            })
          })
      }
    })
  // make a query
  db.pools
    .then((pool) => {
      return pool.request()
        .query('SELECT * FROM createdGroup')
    })
    .then(result => {
      // Check if group name exists
      if (groups.groupLogic.groupExistsInCreatedGroup(result.recordset, groupName) === true) {
        req.flash('errormessage', 'This Group Already Exists !')
        res.redirect(req.baseUrl + '/createGroup')
      } else {
        // store the created group info into cookies:
        res.cookie('admin', `${userName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('newGroupName', `${groupName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('dayGroupCreated', `${day}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('monthGroupCreated', `${month}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('yearGroupCreated', `${year}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')

        // insert this group into created group table
        db.pools
          .then((pool) => {
            return pool.request()
              .query(`INSERT INTO createdGroup (groupName, dateCreated, userName_ID) VALUES ('${groupName}', '${year}-${month}-${day}', '${userName}')`)
            // to-do: global user sessions
          })
          .catch(err => {
            console.log(err)
          })
        // insert this into existing createGroup
        db.pools
          .then((pool) => {
            return pool.request()
              .query(`INSERT INTO existingGroup (groupName_ID, userName_ID) VALUES ('${groupName}', '${userName}')`)
            // to-do: global user sessions
          })
          .catch(err => {
            console.log(err)
          })
        console.log(userName, 'created study group called', groupName)
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

// kick member out
router.post('/api/removeMember', redirectLogIn, function (req, res) {
  const userName = req.body.userName
  const groupName = req.cookies.newGroupName
  const reason = req.body.reason
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
      // perfoming a query
        .query(`INSERT INTO logActivities (initiatedBy, activity, inGroup, dateAndTime) VALUES ('${sessions.getUser()}', 'Initatiated a vote to remove member ${userName}','${sessions.getActiveGroup()}', '${year}-${month}-${day} ${hour}:${minutes}:${seconds}');`)
    })
  // Processing the response
    .then(result => {
      console.log('logged successfully')
    })
  // If there's an error, return that with some description
    .catch(err => {
      console.log(err)
    })
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT existingGroup.userName_ID, appUser.email FROM existingGroup INNER JOIN appUser ON existingGroup.userName_ID = appUser.userName WHERE groupName_ID = '${sessions.getActiveGroup()}'`)
    })
    .then(result => {
      for (let index = 0; index < result.recordset.length; index++) {
        send.kickInitiated(result.recordset[index].email, result.recordset[index].userName_ID, groupName, userName)
      }
    })

  db.pools
    .then((pool) => {
      return pool.request()
        .query('SELECT * FROM existingGroup')
    })
    .then(result => {
      console.log('before if statement')
      // See if the user to be removed is part of study group in question
      if ((groups.groupLogic.userPartOfGroup(result.recordset, groupName, userName)) && (groups.voteCount.kickNumberOfYes(result.recordset, groupName))) {
        console.log('inside if statement')
        db.pools
          .then((pool) => {
            return pool.request()
              .query('DELETE FROM existingGroup WHERE groupName_ID = \'' + groupName + '\' AND userName_ID = \'' + userName + '\'')
          })
          .catch(err => {
            console.log(err)
          })

          .then(result => {
            db.pools
              .then((pool) => {
                return pool.request()
                  .query(`UPDATE existingGroup SET kickMember = 'null' WHERE groupName_ID = '${groupName}'`)
              })
              .catch(err => {
                console.log(err)
              })
            res.redirect(req.baseUrl + '/CreatedGroup')
          })

        // make a query to notify them via email
        db.pools
          .then((pool) => {
            return pool.request()
              .query('SELECT * FROM appUser')
          })
          .then(result => {
            const index = result.recordset.findIndex(function (elem) {
              return elem.userName === userName
            })
            if (index >= 0) {
              send.removeMember(result.recordset[index].email, result.recordset[index].userName, groupName, reason)
            }
          })
      } else if ((groups.groupLogic.userPartOfGroup(result.recordset, groupName, userName)) && !(groups.voteCount.kickNumberOfYes(result.recordset, groupName))) {
        console.log('else if statement')
        req.flash('errormessage', 'Voting in progress !')
        res.redirect(req.baseUrl + '/removeMember')
      } else {
        console.log('Seems this member is not part of the group')
        req.flash('errormessage', 'Seems this member is not part of the group')
        res.redirect(req.baseUrl + '/removeMember')
      }
    })
  // Catched an error beacuse the table is empty
    .catch(err => {
      console.log('last catched error')
      res.send({ Error: err })
    })
})

// Leave group
router.post('/api/leaveGroup', redirectLogIn, function (req, res) {
  const groupName = req.body.groupName
  const userName = req.cookies.username
  const reason = req.body.reason

  // make query to check that user is a member of the group
  db.pools
    .then((pool) => {
      return pool.request()
        .query('SELECT * FROM existingGroup ')
    })
    .then(result => {
      if (groups.groupLogic.userPartOfGroup(result.recordset, groupName, userName)) {
        // query to delete user from user-group-relation table
        db.pools
          .then((pool) => {
            // update group cookies to be empty after a group as a group is about to be deleted
            res.cookie('admin', '', { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
            res.cookie('newGroupName', '', { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
            res.cookie('dayGroupCreated', '', { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
            res.cookie('monthGroupCreated', '', { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
            res.cookie('yearGroupCreated', '', { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')

            return pool.request()
              .query('DELETE FROM existingGroup WHERE groupName_ID = \'' + groupName + '\' AND userName_ID = \'' + userName + '\'')
          })
          .catch(err => {
            console.log(err)
          })
        db.pools
          // Run query
          .then((pool) => {
            return pool.request()
              // perfoming a query
              .query(`INSERT INTO logActivities (initiatedBy, activity, inGroup) VALUES ('${sessions.getUser()}', 'Left the group','${sessions.getActiveGroup()}');`)
          })
          // Processing the response
          .then(result => {
            console.log('logged successfully')
          })
          // If there's an error, return that with some description
          .catch(err => {
            console.log(err)
          })
        // make a query to notify them via email
        db.pools
          .then((pool) => {
            return pool.request()
              .query('SELECT * FROM appUser')
          })
          .then(result => {
            const index = result.recordset.findIndex(function (elem) {
              return elem.userName === userName
            })
            if (index >= 0) {
              send.leaveGroup(result.recordset[index].email, result.recordset[index].userName, groupName, reason)
              res.redirect(req.baseUrl + '/homepage')
            } else {
              res.redirect(req.baseUrl + '/createGroup')
            }
          })

        // add the group name to list of recommended study groups
        db.pools
          .then((pool) => {
            return pool.request()
              .query(`SELECT * FROM existingGroup WHERE groupName_ID = '${groupName}' AND userName_ID= '${userName}'`)
          })
          .then(result => {
            if (!groups.groupLogic.userPartOfGroup(result.recordset, groupName, userName)) {
              db.pools
                .then((pool) => {
                  return pool.request()

                  // add course name and user pair into courseNameAndAppUser database
                    .query(`INSERT INTO recommendations(studyGroup, userName_ID) VALUES ('${groupName}', '${userName}')`)
                })
            }
          })
      } else {
        console.log('It seems you are not a member of this group')
        res.redirect(req.baseUrl + '/homepage')
      }
    })
    // Catched an error beacuse the table is empty
    .catch(err => {
      res.send({ Error: err })
    })
})

// Manage courses here manageCourses
router.post('/api/manageCourses', redirectLogIn, function (req, res) {
  const courses = {
    course1: req.body.Course1,
    course2: req.body.Course2,
    course3: req.body.Course3,
    course4: req.body.Course4
  }
  const user = req.cookies.username

  if (groups.coursesLogic.acceptableFormat(courses.course1, courses.course2, courses.course3, courses.course4)) {
    db.pools
      .then((pool) => {
        return pool.request()

        // A course is first added into the course name table before it is linked with a user in the course&AppUser table
          .query(`INSERT INTO courses(courseName, userName_ID) VALUES ('${courses.course1}', '${user}'), ('${courses.course2}', '${user}'), ('${courses.course3}', '${user}'), ('${courses.course4}', '${user}')`)
      })

    // send back the result
      .then(_result => {
        res.redirect(req.baseUrl + '/homepage')
      })
    // If there's an error, return that with some description
      .catch(err => {
        res.send({
          Error: err
        })
      })
  } else {
    req.flash('errormessage', 'You have entered duplicated courses or have left an empty course field. Please ensure that you enter no duplicate courses and fill in all fields.')
    res.redirect(req.baseUrl + '/manageCourses')
    console.log('You have entered duplicated courses, please fix this.')
  }
})

module.exports = {
  router,
  student
}
