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

//Add member
router.get('/joinByInvite', redirectLogIn, function (req, res) {
  // res.sendFile(path.join(__dirname, 'views', 'user', 'joinByInvite.html'))
  res.render('joinByInvite', { errormessage: req.flash('errormessage') })
})

//Visit a project or Go into a project
router.get('/project', redirectLogIn, function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'projects.html'))
})

//Search projects
router.get('/searchProjects', redirectLogIn, function (req, res) {
  res.render('searchProject', { errormessage: req.flash('errormessage') })
})

//After finding a project that was searched for.
router.get('/joinProject', redirectLogIn, function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'user', 'foundProject.html'))
})

//Take to homepage
router.get('/homepage', redirectLogIn, function (req, res) {
  res.render('homepage', { errormessage: req.flash('errormessage') })
})

//list projects
router.get('/api/projectlist', function (req, res) {
  // Make a query to the database
  const user = req.cookies.username
  const employeeNumber_ID= req.cookies.employeeNumber
  
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // perfoming a query
        .query(`SELECT * FROM existingProject WHERE employeeNumber_ID = '${employeeNumber_ID}'`)
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

  //Capture date the project was created
  // had to create these global variables for logging purposes
  const today = new Date()
  const created_day = String(today.getDate()).padStart(2, '0')
  const created_month = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  const created_year = today.getFullYear()

  
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
        res.cookie('admin', `${userName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/projectHomeTemplate')
        res.cookie('newGroupName', `${projectName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/projectHomeTemplate')
        res.cookie('dayGroupCreated', `${created_day}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/projectHomeTemplate')
        res.cookie('monthGroupCreated', `${created_month}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/projectHomeTemplate')
        res.cookie('yearGroupCreated', `${created_year}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/projectHomeTemplate')

        // insert this project into uniqueProjects table
        db.pools
          .then((pool) => {
            return pool.request()
              .query(`INSERT INTO uniqueProjects (projectName, startDate, endDate, description, progress, employeeNumber_ID, dateCreated) 
                        VALUES('${projectName}', '${start_year}-${start_month}-${start_day}', '${end_year}-${end_month}-${end_day}', '${description}', '${progressStatus}', '${employeeNumber_ID}', '${created_year}-${created_month}-${created_day}' )`);

          })
          .catch(err => {
            console.log(err)
          })

        // insert this into existingProjects
        db.pools
          .then((pool) => {
            return pool.request()
              .query(`INSERT INTO existingProject (projectName_ID, employeeNumber_ID) VALUES ('${projectName}', '${employeeNumber_ID}')`)
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

// enter project- Set logged user variables.
router.post('/api/enterProject', redirectLogIn, function (req, res) {
  const projectName = req.body.project
  sessions.setActiveGroup(projectName)
  console.log(`The active group you in: ${sessions.getActiveGroup()}`)
  console.log(`The group you have entered is: ${projectName}`)

  //reset cookies with data on the database
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT * FROM uniqueProjects WHERE projectName = '${projectName}'`)
    })
    .then(result => {
      if (groups.groupLogic.groupExistsInCreatedGroup(result.recordset, projectName) === true) {
        const userName = result.recordset[0].employeeNumber_ID
        const day = String(result.recordset[0].dateCreated.getDate()).padStart(2, 0)
        const month = String(result.recordset[0].dateCreated.getMonth() + 1).padStart(2, 0)
        const year = result.recordset[0].dateCreated.getFullYear()

        res.cookie('admin', `${userName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/projectHomeTemplate')
        res.cookie('newGroupName', `${projectName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/projectHomeTemplate')
        res.cookie('dayGroupCreated', `${day}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/projectHomeTemplate')
        res.cookie('monthGroupCreated', `${month}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/projectHomeTemplate')
        res.cookie('yearGroupCreated', `${year}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/projectHomeTemplate')
        res.redirect(req.baseUrl + '/CreatedProject')
      }
    })
})

//join group by invite
router.post('/api/joinByInvite', redirectLogIn, function (req, res) {
  const invitee = req.body.employeeNumber
  const projectName = req.cookies.newGroupName
  const inviter = req.cookies.username
  const reason = `${inviter}`
  console.log(`Adding member ${invitee} to project ${projectName} by ${inviter}`)
  
  //search emails of current employees and send email
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT existingProject.employeeNumber_ID, employees.email FROM existingProject INNER JOIN employees ON existingProject.employeeNumber_ID = employees.employeeNumber WHERE projectName_ID = '${sessions.getActiveGroup()}'`)
    })
    .then(result => {
      for (let index = 0; index < result.recordset.length; index++) {
        send.addMember(result.recordset[index].email, result.recordset[index].employeeNumber_ID, projectName, invitee)
      }
    })

        db.pools
          .then((pool) => {
            return pool.request()
              .query('SELECT * FROM existingProject')
          })
          .then(result => {
          //if the invitee user is not part of the project in question, add them to the project
            if (!groups.groupLogic.userPartOfGroup(result.recordset, projectName, invitee)) {
              db.pools
                .then((pool) => {
                  return pool.request()
                    .query(`INSERT INTO existingProject (projectName_ID, employeeNumber_ID) VALUES ( '${projectName}', '${invitee}')`)
                })

                .then(result => {
                  res.redirect(req.baseUrl + '/CreatedProject')
                })

              // make a query to notify added member via email that they part of a new group
              db.pools
                .then((pool) => {
                  return pool.request()
                    .query('SELECT * FROM employees')
                })
                .then(result => {
                  const index = result.recordset.findIndex(function (elem) {
                    return elem.employeeNumber === invitee
                  })
                  if (index >= 0) {
                    send.invitedIntoGroup(result.recordset[index].email, result.recordset[index].employeeNumber, projectName, reason)
                  }
                })
                // else if invitee is already part of project. Redirect to project homepage
              } else {
              res.redirect(req.baseUrl + '/CreatedProject')
              }
          })
})

// Search Project
router.post('/api/searchProjects', redirectLogIn, function (req, res) {
  const projectName = req.body.searchingProject
  console.log(`Searching for the following project ${projectName}`)

  // make a query
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT * FROM uniqueProjects WHERE projectName = '${projectName}'`)
    })
    .then(result => {
      // Check if group name exists
      if (groups.groupLogic.groupExistsInCreatedGroup(result.recordset, projectName) === true) {
        res.cookie('groupName', `${projectName}`, { maxAge: 9000000000, httpOnly: false })
        console.log(`found project ${projectName} in uniqueProjects`)
        res.redirect(req.baseUrl + '/joinProject')
      } else {
        req.flash('errormessage', 'This Project Does Not Exist!')
        res.redirect(req.baseUrl + '/searchProjects')
      }
    })
})

// Join Group
router.post('/api/joinProject', redirectLogIn, function (req, res) {
  const projectName = req.cookies.groupName
  const user = req.cookies.username
  
    if (req.body.joinProjectAnswer === 'yes') {
      console.log(`The following project Mananger ${user} wants to join project.`)

      // check if the user is not part of project already
      db.pools
      .then((pool) => {
        return pool.request()
          .query(`SELECT * FROM existingProject WHERE projectName_ID = '${projectName}' AND employeeNumber_ID= '${user}'`)
      })
      .then(result => {
        // if the user and searched for project are found in existing group- redirect to project Home Page
        if ((groups.groupLogic.groupExistsInExistingGroup(result.recordset, projectName)) && (groups.groupLogic.userPartOfExistingGroup(result.recordset, user))) {
          if (result.recordset[0].projectName_ID === projectName & result.recordset[0].employeeNumber_ID === user) {
            console.log('you are already a member of this project')
            db.pools
              .then((pool) => {
                return pool.request()
                  .query(`SELECT * FROM uniqueProjects WHERE projectName = '${projectName}'`)
              })
              .then(result => {
                if (groups.groupLogic.groupExistsInCreatedGroup(result.recordset, projectName) === true) {
                  const userName = result.recordset[0].employeeNumber_ID
                  const day = String(result.recordset[0].dateCreated.getDate()).padStart(2, 0)
                  const month = String(result.recordset[0].dateCreated.getMonth() + 1).padStart(2, 0)
                  const year = result.recordset[0].dateCreated.getFullYear()

                  res.cookie('admin', `${userName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
                  res.cookie('newGroupName', `${projectName}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
                  res.cookie('dayGroupCreated', `${day}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
                  res.cookie('monthGroupCreated', `${month}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
                  res.cookie('yearGroupCreated', `${year}`, { maxAge: 9000000000, httpOnly: false }, 'path= /user/studygroupTemp')
                  res.redirect(req.baseUrl + '/CreatedProject')
                  console.log(result.recordset[0])
                } else {
                  // if the group is found in existing projects but not created group
                  res.send('This group doesnt exist in unique Projects Table')
                }
              })

              .catch(err => {
                res.send({
                  Error: err
                })
              })
          }
        } else {
          // Else, if the user is not part of project already, proceed to add them to existing Projects
          db.pools
            .then((pool) => {
              return pool.request()
                .query(`INSERT INTO existingProject (projectName_ID, employeeNumber_ID) VALUES ( '${projectName}', '${user}')`)
            })

            .then(result => {
              // Take back to homepage after joining a group
              res.redirect(req.baseUrl + '/homepage')
            })

            .catch(err => {
              res.send({
                Error: err
              })            
            })
          }
        })
      } else {
        // if no entered to join group
        // Send back to homepage
        res.redirect(req.baseUrl + '/homepage')
      }
})






module.exports = {
  router,
  employee
}
