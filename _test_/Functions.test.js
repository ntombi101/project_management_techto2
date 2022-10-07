/* eslint-env jest */

// -------------------------------------------Welcome Page Tests-----------------------------------------------

// Testing the add zero function
const functions = require('../public/scripts/user/Functions.js')

const zeroAppended = functions.welcomePage.addZero(1)
test('Zeros appended/Added to single digit numbers', () => {
  expect(zeroAppended).toMatch(/01/)
})

const zeroNotAppended = functions.welcomePage.addZero(11)
test('Zeros not appended/Added to double digit numbers', () => {
  expect(zeroNotAppended).toMatch(/11/)
})