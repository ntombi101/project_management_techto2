'use strict'

const db = require('./database/db')
const path = require('path')
const express = require('express')
const mainRouter = express.Router()
const bcrypt = require('bcryptjs')
const Gcode = Math.random().toString(36).replace('0.', '')
const session = require('./public/scripts/user/sessions.js')
const send = require('./public/scripts/user/emailNotifications.js')

const student = {
  username: 'Admin',
  name: 'Admin',
  surname: 'Admin',
  studentNumber: 'Admin'
}

// Redirect webpages which check if a user is authenticated
const redirectHome = (req, res, next) => {
  if (req.session.loggedIn) {
    res.redirect('/user/homepage')
  } else {
    next()
  }
}

mainRouter.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'index.html'))
})

mainRouter.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'about.html'))
})

mainRouter.get('/login', redirectHome, function (req, res) {
  res.render('signin', { errormessage: req.flash('errormessage') })
})

mainRouter.get('/register', redirectHome, function (_req, res) {
  res.render('signupform')
})

mainRouter.get('/resetPassword', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'resetPassword.html'))
})

// Generate and email G-Code.
mainRouter.get('/generateCode', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'generateCode.html'))
})

mainRouter.get('/database', function (req, res) {
  // make a query to the database
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()

        .query('SELECT * FROM meetingRequests')
    })
    // send back the result
    .then(result => {
      res.send(result)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

mainRouter.post('/api/login', redirectHome, function (req, res) {
  const username = req.body.Username
  const password = req.body.Password

  db.pools
    .then((pool) => {
      return pool.request()
        .query('SELECT * FROM appUser')
    })

    .then((result) => {
      const index = result.recordset.findIndex(function (elem) {
        return elem.userName === username
      })
      if (index >= 0) {
        // Load hash from database
        if (bcrypt.compareSync(password, result.recordset[index].password) === true) {
          student.username = username
          student.name = result.recordset[index].firstName
          student.surname = result.recordset[index].lastName
          student.studentNumber = result.recordset[index].studentNumber

          req.session.loggedIn = true
          console.log(req.session.loggedIn)
          session.setUser(username)
          console.log(`logged in user is ${session.getUser()}`)

          // store the user name as a cookie
          const userNameCookie_ = `${username}`
          const userWelcomeMessage_ = `welcome ${username}`
          console.log(`new greeting msg:  ${userNameCookie_}`)
          res.cookie('username', `${userNameCookie_}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/homepage')
          res.cookie('welcomemessage', `${userWelcomeMessage_}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/homepage')
          res.cookie('user', `${student.username}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/viewMeetings')
          res.redirect(req.baseUrl + '/user/homepage')
        } else {
          req.flash('errormessage', 'Incorrect Username or Password')
          res.redirect(req.baseUrl + '/login')
        }
      }
    })

    .catch(err => {
      res.send({ Error: err })
    })
})

mainRouter.post('/api/generateCode', (req, res) => {
  console.log('Verifying user email')
  const username = req.body.userName
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query('SELECT * FROM appUser')
    })
    // Processing the response
    .then(result => {
      const index = result.recordset.findIndex(function (elem) {
        return elem.userName === username
      })
      if (index >= 0) {
        send.resetPassword(result.recordset[index].email, result.recordset[index].userName, Gcode)
        res.redirect(req.baseUrl + '/resetPassword')
      } else {
        res.redirect(req.baseUrl + '/generateCode')
      }
    })
})

mainRouter.post('/api/resetPassword', (req, res) => {
  // Make a query to the database
  const username = req.body.userName
  const password = req.body.password

  db.pools
    // Run query
    .then((pool) => {
      const salt = bcrypt.genSaltSync(10)
      const dbrequest = pool.request()

      dbrequest.input('userp', `${bcrypt.hashSync(password, salt)}`)
      dbrequest.input('nam', `${username}`)
      // perfoming a query
      if (Gcode === req.body.gcode) {
        return dbrequest
          .query('UPDATE appUser SET password = @userp WHERE userName = @nam')
      } else {
        res.send('codes do not match, please check code')
      }
    })
    .then(result => {
      // console.log(result.recordset)
      res.redirect(req.baseUrl + '/login')
    })
})

mainRouter.post('/api/register', redirectHome, function (req, res) {
  console.log('registering in the following user:', req.body.Name)
  const studentObject = {
    firstName: req.body.Name,
    lastName: req.body.Surname,
    emailAddress: req.body.email,
    userName: req.body.userName,
    studNumber: req.body.studentNumber,
    Password: req.body.password
  }

  // making first query
  db.pools
    .then((pool) => {
      return pool.request()
        .query('SELECT * FROM appUser')
    })

    .then(result => {
      const index = result.recordset.findIndex(function (elem) {
        return elem.email === studentObject.emailAddress
      })
      if (index >= 0) {
        req.flash('errormessage', 'Already registered')
        res.redirect(req.baseUrl + '/login')
      }
    })
    .catch(err => {
      res.send({
        Error: err
      })
    })

  // Hash Password
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(studentObject.Password, salt)
  studentObject.Password = hash

  // make a query to the database
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()

        .query(`INSERT INTO appUser(userName, email, firstName, lastName, studentNumber, CovidFlag, Adress, City, PostalCode, password) VALUES ('${studentObject.userName}', '${studentObject.emailAddress}', '${studentObject.firstName}', '${studentObject.lastName}', '${studentObject.studNumber}', NULL, NULL, NULL, NULL, '${studentObject.Password}')`)
    })
    // send back the result
    .then(_result => {
      res.redirect(req.baseUrl + '/user/homepage')
    })
    
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

module.exports = mainRouter
