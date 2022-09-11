'use strict'

const nodemailer = require('nodemailer')

module.exports = {

  resetPassword: function (Email, Username, Gcode) {
    // Welcome users with an email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'eiestudygroup9@gmail.com',
        pass: process.env.db_password
      }
    })

    const mailOptions = {
      from: 'webappeie9@gmail.com',
      to: Email,
      subject: 'Reset password study coordinator',
      text: 'We are within',
      html: `<center><h1>Greetings, ${Username},</h1><br/><br/><p>  
                  <h2>Please use the following Code <br/>
                  to reset your password,<br/>
                  Code: ${Gcode}<br/><br/><br/></center> 
                  EIE Group 9<br/>
                  Group 9 PTY LTD</p></h2>`
    }

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log('Error has occured: ', err)
      } else {
        console.log('Email sent successfully')
      }
    })
  },

  // Notifiation for a member leaving  group
  leaveGroup: function (Email, Username, GroupName, Reason) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'eiestudygroup9@gmail.com',
        pass: process.env.db_password
      }
    })

    const mailOptions2 = {
      from: 'webappeie9@gmail.com',
      to: Email,
      subject: 'Leaving A Group in Study Coordinator',
      text: 'We are within',
      html: `<center>
            <h1>Hi ${Username}.</h1><br/><br/><p>  
            <h2>This email is to confirm that you've opted to leave the 
                ${GroupName} study group beacuse you ${Reason}.</h2>
                <br/>
                <br/>
                <h2>Best wishes from EIE Group 9<br/>
                    Group 9 PTY LTD</p></h2>`
    }

    transporter.sendMail(mailOptions2, (err, data) => {
      if (err) {
        console.log('Error has occured: ', err)
      } else {
        console.log('Email sent successfully')
      }
    })
  },

  // Notifiation to notify a member that they were invited and added into a group
  invitedIntoGroup: function (Email, Username, GroupName, Reason) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'eiestudygroup9@gmail.com',
        pass: process.env.db_password
      }
    })

    const mailOptions3 = {
      from: 'webappeie9@gmail.com',
      to: Email,
      subject: 'Study Group Invitation',
      text: 'We are within',
      html: `<center>
            <h1>Hi ${Username}.</h1><br/><br/><p>  
            <h2>This email is to confirm that you have been invited and added into
                ${GroupName} study group by ${Reason}.</h2>
                <br/>
                <h3>You may now participate in the activities of this group.</h3><br/><br/><p>
                <br/>
                <h2>Best wishes from EIE Group 9<br/>
                    Group 9 PTY LTD</p></h2>`
    }

    transporter.sendMail(mailOptions3, (err, data) => {
      if (err) {
        console.log('Error has occured: ', err)
      } else {
        console.log('Email sent successfully')
      }
    })
  },

  // Notifiation to notify members that voting has started
  voteInitiated: function (Email, Username, GroupName, invitee) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'eiestudygroup9@gmail.com',
        pass: process.env.db_password
      }
    })

    const mailOptions4 = {
      from: 'webappeie9@gmail.com',
      to: Email,
      subject: 'Vote to add a Member',
      text: 'We are within',
      html: `<center>
            <h1>Hi ${Username}.</h1><br/><br/><p>  
            <h2>A new member addition vote to add ${invitee} has been triggered in study group ${GroupName} please visit the groups voting tab to cast your vote. Please Ignore this email if you have already cast your vote
            </h2>
                <br/>
                <h3>Your participation is most welcomed</h3><br/><br/><p>
                <br/>
                <h2>Best wishes from EIE Group 9<br/>
                    Group 9 PTY LTD</p></h2>`
    }

    transporter.sendMail(mailOptions4, (err, data) => {
      if (err) {
        console.log('Error has occured: ', err)
      } else {
        console.log('Email sent successfully')
      }
    })
  },

  // Notifiation to notify members that voting has started
  kickInitiated: function (Email, Username, GroupName, invitee) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'eiestudygroup9@gmail.com',
        pass: process.env.db_password
      }
    })

    const mailOptions4 = {
      from: 'webappeie9@gmail.com',
      to: Email,
      subject: 'Vote to Remove a Member',
      text: 'We are within',
      html: `<center>
            <h1>Hi ${Username}.</h1><br/><br/><p>  
            <h2>A new member removal vote to remove ${invitee} has been triggered in study group ${GroupName} please visit the groups voting tab to cast your vote. Please Ignore this email if you have already cast your vote
            </h2>
                <br/>
                <h3>Your participation is most welcomed</h3><br/><br/><p>
                <br/>
                <h2>Best wishes from EIE Group 9<br/>
                    Group 9 PTY LTD</p></h2>`
    }

    transporter.sendMail(mailOptions4, (err, data) => {
      if (err) {
        console.log('Error has occured: ', err)
      } else {
        console.log('Email sent successfully')
      }
    })
  },

  // Notifiation to notify a member that they were invited and added into a group
  removeMember: function (Email, Username, GroupName, Reason) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'eiestudygroup9@gmail.com',
        pass: process.env.db_password
      }
    })

    const mailOptions4 = {
      from: 'webappeie9@gmail.com',
      to: Email,
      subject: 'Removal From Study Group',
      text: 'We are within',
      html: `<center>
            <h1>Hi ${Username}.</h1><br/><br/><p>  
            <h2>This email is to confirm that you have been removed from the
                ${GroupName} study group because ${Reason}.</h2>
                <br/>
                <br/>
                <h2>Best wishes from EIE Group 9<br/>
                    Group 9 PTY LTD</p></h2>`
    }

    transporter.sendMail(mailOptions4, (err, data) => {
      if (err) {
        console.log('Error has occured: ', err)
      } else {
        console.log('Email sent successefully')
      }
    })
  },

  // Notifiation to notify a member has arrived home safe from a meeting
  arrivedHomeSafe: function (Email, groupMember, GroupName, emailSender) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'eiestudygroup9@gmail.com',
        pass: process.env.db_password
      }
    })

    const mailOptions5 = {
      from: 'webappeie9@gmail.com',
      to: Email,
      subject: 'Arrived Home Safe Notification',
      text: 'We are within',
      html: `<center>
            <h1>Hi ${groupMember}.</h1><br/><br/><p>  
            <h2>This email is to confirm that ${emailSender} from the
                ${GroupName} study group has arrived safe from your recent face to face meeting.</h2>
                <br/>
                <br/>
                <h2>Best wishes from EIE Group 9<br/>
                    Group 9 PTY LTD</p></h2>`
    }

    transporter.sendMail(mailOptions5, (err, data) => {
      if (err) {
        console.log('Error has occured: ', err)
      } else {
        console.log('Email sent successefully')
      }
    })
  }

}
