'use strict'

//Dependencies
const express = require('express')
const http = require('http')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const socketio = require('socket.io')
const flash = require('connect-flash')
const db = require('./database/db')
const cors = require('cors')
const Autolinker = require('autolinker')
const app = express()
const server = http.createServer(app)
app.use(cookieParser())
const io = socketio(server)

//Linked files/modules 
const format = require('./public/scripts/user/messages.js')
const active = require('./public/scripts/user/sessions.js')

// had to create these global variables for logging purposes
const today = new Date()
const day = String(today.getDate()).padStart(2, '0')
const month = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
const year = today.getFullYear()

const hour = today.getHours()
const minutes = today.getMinutes()
const seconds = today.getSeconds()

// Map object
const clientLocation = new Map()

// Setting up EJS
app.set('view engine', 'ejs')

// Setting up Sessions Management for cookies storage
const MemoryStore = require('memorystore')(session)

// loading body-parser
const bodyParser = require('body-parser')

// loading our routers
const mainRouter = require('./mainRoutes')
const userRouter = require('./userRoutes')
const groupsRouter = require('./groupsRoutes')

// tell Express to use bosyParser for JSON and URL encoded from bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// enable cors
app.use(cors())

// These should Ideally be stored in environmetal variables I left them exposed for testing purposes
// They're just dummy variables that will be changed to more secure values and stored in env's
const {
  SESS_LIFETIME = 1000 * 60 * 60 * 2, // two hours
  NODE_ENV = 'development',
  SESS_NAME = 'newSes',
  SESS_SECRET = 'group9secret'
} = process.env

const IN_PROD = NODE_ENV === 'production'

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD
  },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24hrs
  })
}))

app.use(flash())
// mounting our routers
app.use(mainRouter)
app.use('/user', userRouter.router)
app.use('/groups', groupsRouter.router)
app.use('/cdn', express.static('public')) /* This will mount your public directory to '/cdn'.
i.e. your scripts folder will be at /cdn/scripts */

// Run when client connects (for chat functionality)
io.on('connection', socket => {
  db.pools
  // Run query get messages from database
    .then((pool) => {
      return pool.request()

        .query(`SELECT * FROM Resources WHERE groupName_ID = '${active.getActiveGroup()}'`)
    })
  // send back the result
    .then(result => {
      format.setExistingMessages(result.recordset)
      const mss = format.getExistingMessages()
      // Load Existing Messages
      for (let a = mss.length - 1; a > -1; a--) {
        const autolinker = new Autolinker()
        io.emit('message', format.formatMessage(mss[a].userName_ID, autolinker.link(mss[a].resourcesLink), `${mss[a].dateTime.getHours() - 2}:${String(mss[a].dateTime.getMinutes()).padStart(2, '0')}`, `${String(mss[a].dateTime.getDate()).padStart(2, '0')}/${String(mss[a].dateTime.getMonth() + 1).padStart(2, '0')}/${mss[a].dateTime.getFullYear()}`))
      }
    })
  // If there's an error, return that with some description
    .catch(err => {
      console.log(err)
    })

  // Listen for message
  socket.on('chatMessage', msg => {
    const autolinker = new Autolinker()
    io.emit('message', format.formatMessage(active.getUser(), autolinker.link(msg), `${hour}:${minutes}`, `${day}/${month}/${year}`))
    db.pools
    // Run query add new chats to the database
      .then((pool) => {
        return pool.request()

          .query(`INSERT INTO Resources(resourcesLink, resourceName, dateTime, groupName_ID, userName_IDresourcesLink, resourceName, dateTime, groupName_ID, userName_ID) VALUES ('${msg}', 'link', '${year}-${month}-${day} ${hour}:${minutes}:${seconds}', '${active.getActiveGroup()}', '${active.getUser()}')`)
      })

      // If there's an error, return that with some description
      .catch(err => {
        console.log(err)
      })



    //Log activities
    db.pools
      // Run query
      .then((pool) => {
        return pool.request()
          // perfoming a query
          .query(`INSERT INTO logActivities (initiatedBy, activity, inGroup, dateAndTime) VALUES ('${active.getUser()}', 'Added a message in the chat', '${active.getActiveGroup()}', '${year}-${month}-${day} ${hour}:${minutes}:${seconds}');`)
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

  // Update location using socket id as a key
  socket.on('updateLocation', pos => {
    clientLocation.set(socket.id, pos)
    const latitude = pos.lat
    const longitude = pos.lng

    db.pools
      .then((pool) => {
        return pool.request()
          .query(`UPDATE meetingRequests 
                  SET latitude = '${latitude}',  longitude ='${longitude}'
                  WHERE userName_ID = '${active.getUser()}' AND meetingStatus = '${1}'`)
      })
      .then(result => {
        // if the meeting status is 1, then this user is attending a meeting
        // console.log('recordset', result.recordset[0].nameOfPersonRequesting)
      })
      .catch(err => {
        console.log(err)
      })
  })

  socket.on('disconnect', () => {
    clientLocation.delete(socket.id)
  })
  //
})

const port = process.env.PORT || 8080
server.listen(port)
console.log('Express server running on port', port)
