'use strict'

const path = require('path')
const express = require('express')
const router = express.Router()
const db = require('./database/db')
const session = require('./public/scripts/user/sessions.js')
const sessions = require('./public/scripts/user/sessions.js')
const ArrivedSafeNotification = require('../2021-009-project/public/scripts/user/Functions.js')
const send = require('./public/scripts/user/emailNotifications.js')
const {getActiveGroup } = require('./public/scripts/user/sessions.js')

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


router.get('/members', redirectLogIn, function (_req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'members.html'))
})

router.get('/resources', redirectLogIn, function (_req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'resources.html'))
})

router.get('/default', redirectLogIn, function (_req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'default.html'))
})

router.get('/homepage', redirectLogIn, function (req, res) {
  const employeeNumber_ID= req.cookies.employeeNumber

  db.pools
  // Run query
  .then((pool) => {
    return pool.request()
      // perfoming a query
      .query(`SELECT employees.occupation FROM employees WHERE employeeNumber = '${employeeNumber_ID}'`)
  })
  // Processing the response
  .then(result => {
    const employee_Occupation= result.recordset[0].occupation
    console.log(`${employee_Occupation}`)
    if(employee_Occupation === "Project Manager"){
      console.log(`${employee_Occupation}`)
      res.render('homepage', { errormessage: req.flash('errormessage') })
    }else {
      res.render('homepage_employee', { errormessage: req.flash('errormessage') })
    }
  })
  
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
        .query(`SELECT * FROM existingProject WHERE projectName_ID = '${sessions.getActiveGroup()}'`)
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

router.get('/api/listProjects', function (req, res) {
  // Make a query to the database to fetch the unique table data. This is the data that will go into 

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query(`SELECT * FROM existingProject WHERE employeeNumber_ID = '${sessions.getUser()}'`)
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

router.get('/api/listTasks', function (req, res) {
  // Make a query to the database to fetch the unique table data. This is the data that will go into 
  const projectName= req.cookies.newGroupName

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query(`SELECT * FROM tasks WHERE projectName_ID = '${projectName}'`)
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
