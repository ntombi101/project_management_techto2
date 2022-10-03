'use strict'

//Dependencies
const db = require('./database/db')
const path = require('path')
const express = require('express')
const mainRouter = express.Router()
const bcrypt = require('bcryptjs')
const Gcode = Math.random().toString(36).replace('0.', '')
const session = require('./public/scripts/user/sessions.js')
const send = require('./public/scripts/user/emailNotifications.js')

const employee = {
  employeeNumber: 'Admin',
  firstname: 'Admin',
  lastname: 'Admin',
  occupation: 'Admin'
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


//logging in a user/employee (Must be from employees database)
mainRouter.post('/api/login', redirectHome, function (req, res) {
  const employeenumber = req.body.employeeNumber
  const password = req.body.Password

  db.pools
    .then((pool) => {
      return pool.request()
        .query('SELECT * FROM employees')
    })

    .then((result) => {
      const index = result.recordset.findIndex(function (elem) {
        return elem.employeeNumber === employeenumber
      })
      if (index >= 0) {
        // Load hash from database
        if (bcrypt.compareSync(password, result.recordset[index].password) === true) {
          employee.employeeNumber = employeenumber
          employee.firstname = result.recordset[index].firstName
          employee.lastname = result.recordset[index].lastName
          employee.occupation = result.recordset[index].occupation

          req.session.loggedIn = true
          console.log(req.session.loggedIn)
          session.setUser(employeenumber)
          console.log(`logged in user is ${session.getUser()}`)

          // store the employee name as a cookie
          const userNameCookie_ = `${employee.employeeNumber}`
          const userWelcomeMessage_ = `welcome ${employee.firstname}  ${employee.lastname}`
          const user_name_surname= `${employee.lastname}`
          console.log(`new greeting msg:  ${userNameCookie_}`)
          res.cookie('username', `${userNameCookie_}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/homepage')
          res.cookie('employee', `${user_name_surname}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/homepage')
          res.cookie('welcomemessage', `${userWelcomeMessage_}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/homepage')
          res.cookie('user', `${employee.employeeNumber}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/viewMeetings')
          res.cookie('employeeNumber', `${employee.employeeNumber}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/viewMeetings')
          res.redirect(req.baseUrl + '/user/homepage')
        } else {
          req.flash('errormessage', 'Incorrect Employee Number or Password')
          res.redirect(req.baseUrl + '/login')
        }
      }
    })

    .catch(err => {
      res.send({ Error: err })
    })
})

mainRouter.post('/api/generateCode', (req, res) => {
  const employeenumber = req.body.employeeNumber
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query('SELECT * FROM employees')
    })
    // Processing the response
    .then(result => {
      const index = result.recordset.findIndex(function (elem) {
        return elem.employeeNumber === employeenumber
      })
      if (index >= 0) {
        console.log('Verifying user email: ' , result.recordset[index].email)
        send.resetPassword(result.recordset[index].email, result.recordset[index].firstName, Gcode)
        res.redirect(req.baseUrl + '/resetPassword')
      } else {
        res.redirect(req.baseUrl + '/generateCode')
      }
    })
})

mainRouter.post('/api/resetPassword', (req, res) => {
  // Make a query to the database
  const employeenumber = req.body.employeeNumber
  const password = req.body.Password

  db.pools
    // Run query
    .then((pool) => {
      const salt = bcrypt.genSaltSync(10)
      const dbrequest = pool.request()

      dbrequest.input('userp', `${bcrypt.hashSync(password, salt)}`)
      dbrequest.input('nam', `${employeenumber}`)
      // perfoming a query
      if (Gcode === req.body.gcode) {
        return dbrequest
          .query('UPDATE employees SET password = @userp WHERE employeeNumber = @nam')
      } else {
        res.send('codes do not match, please check code')
      }
    })
    .then(result => {
      // console.log(result.recordset)
      res.redirect(req.baseUrl + '/login')
    })
})


//Register an employee
mainRouter.post('/api/register', redirectHome, function (req, res) {
  console.log('registering in the following user:', req.body.lastName)
  const employeeObject = {
    employeeNumber: req.body.employeeNumber,
    lastName: req.body.lastName,
    email: req.body.email,
    firstName: req.body.firtsName,
    department: req.body.department,
    occupation: req.body.occupation,
    Password: req.body.password
  }

  // making first query
  db.pools
    .then((pool) => {
      return pool.request()
        .query('SELECT * FROM employees')
    })

    .then(result => {
      const index = result.recordset.findIndex(function (elem) {
        return elem.employeeNumber === employeeObject.employeeNumber
      })
      if (index >= 0) {
        req.flash('errormessage', 'Already registered')
        res.redirect(req.baseUrl + '/login')
      } else {
        // Hash Password before storing into database
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(employeeObject.Password, salt)
  employeeObject.Password = hash

  // make a query to the database
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
        .query(`INSERT INTO employees(employeeNumber, email, firstName, lastName, department, password, occupation) VALUES ('${employeeObject.employeeNumber}', '${employeeObject.email}', '${employeeObject.firstName}', '${employeeObject.lastName}', '${employeeObject.department}', '${employeeObject.Password}', '${employeeObject.occupation}');`)
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
  }
    })
    .catch(err => {
      res.send({
        Error: err
      })
    })

  
})

module.exports = mainRouter
