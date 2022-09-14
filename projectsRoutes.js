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

//Render project home page Template
router.get('/CreatedProject', redirectLogIn, function (_req, res) {
  res.render('projectHomeTemplate', { errormessage: _req.flash('errormessage') })
}) 

// Create Project with error message for when project already exists.
router.get('/CreateProject', redirectLogIn, function (_req, res) {
  res.render('createProject', { errormessage: _req.flash('errormessage') })
})

router.post('/api/createProject', redirectLogIn, function (req, res) {
  const projectName = req.body.projectName
  const progressStatus = req.body.ProgressStatus
  const description = req.body.description
  const employeeNumber_ID = req.cookies.employeeNumber
  const userName = req.cookies.user

  const string_startDate= JSON.stringify(req.body.startDate)
  const sliced_String_startDate= string_startDate.slice(1,11)
  const [year1, month1, day1] = sliced_String_startDate.split('-')
  const startDate= new Date(year1, month1, day1);
  const start_day = String(startDate.getDate()).padStart(2, '0')
  const start_month = String(startDate.getMonth()).padStart(2, '0')
  const start_year = String(startDate.getFullYear())

  const string_endDate= JSON.stringify(req.body.endDate)
  const sliced_String_endDate= string_endDate.slice(1,11)
  const [year, month, day] = sliced_String_endDate.split('-')
  const endDate= new Date(year, month, day);
  const end_day = String(endDate.getDate()).padStart(2, '0')
  const end_month = String(endDate.getMonth()).padStart(2, '0')
  const end_year = String(endDate.getFullYear())

  
  // make a query to create the new project.
  db.pools
    .then((pool) => {
      return pool.request()
        .query('SELECT * FROM uniqueProjects')
    })
    .then(result => {
      // Check if project already exists.
      if (groups.groupLogic.groupExistsInCreatedGroup(result.recordset, projectName) === true) {
        req.flash('errormessage', 'This Project Already Exists! All projects are required to be Unique. Please try searching the project.')
        res.redirect(req.baseUrl + '/createProject')
      } else {
        // store the created project info into cookies:
        
        /*res.cookie('admin', `${userName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('newGroupName', `${groupName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('dayGroupCreated', `${day}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('monthGroupCreated', `${month}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
        res.cookie('yearGroupCreated', `${year}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')*/

        // insert this project into uniqueProjects table
        db.pools
          .then((pool) => {
            return pool.request()
              .query(`INSERT INTO uniqueProjects (projectName, startDate, endDate, description, progress, employeeNumber_ID) 
                        VALUES('${projectName}', '${start_year}-${start_month}-${start_day}', '${end_year}-${end_month}-${end_day}', '${description}', '${progressStatus}', '${employeeNumber_ID}' )`);

          })
          .catch(err => {
            console.log(err)
          })

        // insert this into existingProjects
        db.pools
          .then((pool) => {
            return pool.request()
             // .query(`INSERT INTO existingProject (projectName_ID, employeeNumber_ID) VALUES ('${projectName}', '${employeeNumber_ID}')`)
            // to-do: global user sessions
          })
          .catch(err => {
            console.log(err)
          })
        console.log(userName, 'created the following project', projectName)
        res.redirect(req.baseUrl + '/CreatedProject')
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
  employee
}
