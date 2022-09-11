(function () { function r (e, n, t) { function o (i, f) { if (!n[i]) { if (!e[i]) { const c = typeof require === 'function' && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); const a = new Error("Cannot find module '" + i + "'"); throw a.code = 'MODULE_NOT_FOUND', a } const p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { const n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = typeof require === 'function' && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
  1: [function (require, module, exports) {
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

    // get group admin name
    studyGroupPageFunctions.setAdmin = function () {
      return this.getAdminNameCookie()
    }

    exports.studyGroupPage = studyGroupPageFunctions
  }, {}],
  2: [function (require, module, exports) {
    const welcomeMessageCookie = require('./Functions')

    // get the userName DOM element
    const welcomeMessage_ = document.getElementById('welcomeMessage')
    welcomeMessage_.innerHTML = `${welcomeMessageCookie.cookies.getCookieWelcomeMessage()}`

    console.log(welcomeMessage_.nodeValue)
  }, { './Functions': 1 }]
}, {}, [2])
