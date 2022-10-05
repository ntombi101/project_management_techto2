// script that manages user sessions
'use strict'

let startDate = null
let endDate = null
let description= null
let progress= null

const setDescription = function (desc) {
    description = desc
}

const getDescription = function () {
    return description
}

const setProgress = function (status) {
    progress = status
}

const getProgress = function () {
    return progress
}

const setStartDate = function (date) {
    startDate = date
}

const getStartDate = function () {
  return startDate
}

const setEndDate = function (date) {
    endDate = date
}

const getEndDate = function () {
    return endDate
}



module.exports = {
  setDescription: setDescription,
  setProgress: setProgress,
  setEndDate: setEndDate,
  setStartDate: setStartDate,
  getDescription: getDescription,
  getProgress: getProgress,
  getEndDate: getEndDate,
  getStartDate: getStartDate

}