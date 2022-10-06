'use strict'

const hasReachedLimit = function (groupList) {
  if (groupList[0].numMembers === 10) { return true } else return false
}

const joinedMaxGroups = function (groupList) {
  if (groupList[0].numGroupsJoined === 10) {
    console.log('Number of groups joined', groupList[0])
    return true
  } else return false
}

const createdMaxGroups = function (groupList) {
  if (groupList[0].numGroupsCreated === 10) {
    console.log('Number of groups created', groupList[0])
    return true
  } else return false
}

module.exports = {
  hasReachedLimit: hasReachedLimit,
  joinedMaxGroups: joinedMaxGroups,
  createdMaxGroups: createdMaxGroups
}