'use strict'

//dependencies
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

//Details of logged in user- global variable.
const employee = {
  employeeNumber: 'Admin',
  firstName: 'Admin',
  lastName: 'Admin',
  occupation: 'Admin'
}

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

router.get('/CreateProject', redirectLogIn, function (_req, res) {
  res.render('createProject', { errormessage: _req.flash('errormessage') })
})

router.get('/project', redirectLogIn, function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'groups.html'))
})


router.get('/api/projectlist', function (req, res) {
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


// Group Project
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


module.exports = {
  router,
  student
}
