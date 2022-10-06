(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    /* --------------------------------------Dash board Functions-------------------------------------------------- */
    const dashBoardWelcomeMsg = {}
    
    // function to read cookies and extract user name
    dashBoardWelcomeMsg.getCookieWelcomeMessage = function () {
      const allCookies = document.cookie
      const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
      const clientWelcomeMessage = splitCookies.welcomemessage
    
      return `${clientWelcomeMessage}`
    }
    
    exports.cookies = dashBoardWelcomeMsg
    
    /* --------------------------------------View Meetings Page Functions-------------------------------------------------- */
    const viewMeetingsPageFunctions = {}
    
    // function to read cookies and extract user name
    viewMeetingsPageFunctions.getUser = function () {
      const allCookies = document.cookie
      const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
      const usersname = splitCookies.user
    
      return `${usersname}`
    }
    
    exports.viewMeetingsPage = viewMeetingsPageFunctions
    
    /* --------------------------------------Welcome Page Functions-------------------------------------------------- */
    
    const welcomePageFunctions = {}
    
    // Function to add zeros to single digit minutes & seconds
    welcomePageFunctions.addZero = function (n) {
      return (parseInt(n, 10) < 10 ? '0' : '') + n
    }
    
    exports.welcomePage = welcomePageFunctions
    
    /* ------------------------------------Study Group Page Functions--------------------------------------------------- */
    const studyGroupPageFunctions = {}
    
    // get created group name
    studyGroupPageFunctions.getGroupNameCookie = function () {
      const allCookies = document.cookie
      const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
      const groupName = splitCookies.newGroupName
    
      return `${groupName}`
    }
    
    // get created group admin
    studyGroupPageFunctions.getAdminNameCookie = function () {
      const allCookies = document.cookie
      const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
      const adminName = splitCookies.admin
    
      return `${adminName}`
    }
    
    // get day created
    studyGroupPageFunctions.getDayCookie = function () {
      const allCookies = document.cookie
      const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
      const day = splitCookies.dayGroupCreated
    
      return `${day}`
    }
    
    // get month created
    studyGroupPageFunctions.getMonthCookie = function () {
      const allCookies = document.cookie
      const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
      const month = splitCookies.monthGroupCreated
    
      return `${month}`
    }
    
    // get year created
    studyGroupPageFunctions.getYearCookie = function () {
      const allCookies = document.cookie
      const splitCookies = allCookies.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {})
      const year = splitCookies.yearGroupCreated
    
      return `${year}`
    }
    
    exports.studyGroupPage = studyGroupPageFunctions
    
    // -----------------------------------------Group Logic Functions------------------------------------------
    const groupLogicFunctions = {}
    
    // check if the group exists in existingGroup table
    groupLogicFunctions.groupExistsInExistingGroup = function (grouplist, groupName) {
      const studygroup = grouplist.filter(studygroup => studygroup.groupName_ID === groupName)
      if (studygroup.length === 0) { return false } else return true
    }
    
    // check if the group exists in createdGroup table
    groupLogicFunctions.groupExistsInCreatedGroup = function (grouplist, groupName) {
      const studygroup = grouplist.filter(studygroup => studygroup.groupName === groupName)
      if (studygroup.length === 0) { return false } else return true
    }
    
    // check if person is part of group in existing group
    groupLogicFunctions.userPartOfExistingGroup = function (grouplist, userName) {
      const name = grouplist.filter(name => name.userName_ID === userName)
      if (name.length === 0) { return false } else return true
    }
    
    // see if user is part of any group at all
    groupLogicFunctions.userPartOfGroup = function (grouplist, groupName, userName) {
      if (groupLogicFunctions.groupExistsInExistingGroup(grouplist, groupName) && (groupLogicFunctions.userPartOfExistingGroup(grouplist, userName))) {
        const found = grouplist.filter(found => (found.groupName_ID === groupName && found.userName_ID === userName))
        if (found.length === 0) { return false } else return true
      } else {
        return false
      }
    }
    
    groupLogicFunctions.userPartOfRecommendation = function (recommendationList, groupName, userName) {
      const found = recommendationList.filter(found => (found.studyGroup === groupName && found.userName_ID === userName))
      if (found.length === 0) { return false } else return true
    }
    
    // See if any table is empty
    groupLogicFunctions.isTableEmpty = function (grouplist) {
      if (grouplist.length === 0) { return true } else return false
    }
    
    exports.groupLogic = groupLogicFunctions
    
    // -----------------------------------------Count Votes Functions------------------------------------------
    const countVotesFunctions = {}
    
    countVotesFunctions.inviteNumberOfYes = function (grouplist, groupName) {
      const totalMembers = grouplist.filter(element => (element.groupName_ID === groupName))
      const totalLength = totalMembers.length
      const found = grouplist.filter(found => (found.groupName_ID === groupName && found.acceptMember === 'Yes'))
      console.log(`Total number of members = ${totalLength}`)
      console.log(`Number of yeses = ${found.length}`)
      if (found.length > (totalLength / 2)
    
      ) { return true } else return false
    }
    
    countVotesFunctions.kickNumberOfYes = function (grouplist, groupName) {
      const totalMembers = grouplist.filter(element => (element.groupName_ID === groupName))
      const totalLength = totalMembers.length
      const found = grouplist.filter(found => (found.groupName_ID === groupName && found.kickMember === 'Yes'))
      console.log(`Total number of members = ${totalLength}`)
      console.log(`Number of yeses = ${found.length}`)
      if (found.length > (totalLength / 2)
    
      ) { return true } else return false
    }
    
    exports.voteCount = countVotesFunctions
    
    // ------------------------------------------Courses Functions--------------------------------------------------------
    
    const courseFunctions = {}
    // user does not enter the same course twice
    courseFunctions.noDuplicateCourses = function (course1, course2, course3, course4) {
      if ((course1 === course2) || (course1 === course3) || (course1 === course4)) { return false } else if ((course2 === course3) || (course2 === course4)) {
        return false
      } else if ((course3 === course4)) {
        return false
      } else { return true }
    }
    
    courseFunctions.emptyCourseField = function (course1, course2, course3, course4) {
      if ((course1.length === 0) || (course2.length === 0) || (course3.length === 0) || (course4.length === 0)) {
        return true
      } else {
        return false
      }
    }
    
    courseFunctions.acceptableFormat = function (course1, course2, course3, course4) {
      if (courseFunctions.noDuplicateCourses(course1, course2, course3, course4) && (!courseFunctions.emptyCourseField(course1, course2, course3, course4))) {
        return true
      } else {
        return false
      }
    }
    
    courseFunctions.splitGroupNamesFromCreatedGrouptable = function (createdGroupTable) {
      let i
      const groupNamesColumn = []
      for (i = 0; i < createdGroupTable.length; i++) {
        groupNamesColumn[i] = createdGroupTable[i].groupName
      }
    
      return groupNamesColumn
    }
    
    courseFunctions.splitStudyGroupsFromRecommendationsTable = function (recommendationsTable) {
      let i
      const studyGroupsColumn = []
      for (i = 0; i < recommendationsTable.length; i++) {
        studyGroupsColumn[i] = recommendationsTable[i].studyGroup
      }
      return studyGroupsColumn
    }
    
    // Filter recommendable courses from recommendations table and createdGroup table
    courseFunctions.findAllCoursesInCreatedGroup = function (createdGroupTable, coursesTable) {
      const newCreatedGroupTable = courseFunctions.splitGroupNamesFromCreatedGrouptable(createdGroupTable)
      const recommendable = coursesTable.filter(course => (newCreatedGroupTable.includes(course.courseName)))
    
      return recommendable
    }
    
    courseFunctions.copyArray = function (Array1, Array2) {
      let i = 0
      for (i = 0; i < Array2.length; i++) {
        Array1[i] = Array2[i]
      }
    }
    
    courseFunctions.twoArrayEqual = function (Array1, Array2) {
      if (JSON.stringify(Array1) === JSON.stringify(Array2)) {
        return true
      } else {
        return false
      }
    }
    
    exports.coursesLogic = courseFunctions
    
    // -----------------------------------------Other functions go below ------------------------------------------
    
    },{}],2:[function(require,module,exports){
    'use strict'
    const functions = require('./Functions')
    
    // manipulating DOM elements
    const admin_ = document.getElementById('groupAdminName')
    const dateCreated_ = document.getElementById('dateCreated')
    const groupWelcomemsg_ = document.getElementById('studyGroupWelcomeMessage1')
    
    dateCreated_.innerHTML = `Date created:  ${functions.studyGroupPage.getYearCookie()} - ${functions.studyGroupPage.getMonthCookie()} - ${functions.studyGroupPage.getDayCookie()}`
    groupWelcomemsg_.innerHTML = functions.studyGroupPage.getGroupNameCookie()
    admin_.innerHTML = `Group is created by: ${functions.studyGroupPage.getAdminNameCookie()}`
    
    },{"./Functions":1}]},{},[2]);
    