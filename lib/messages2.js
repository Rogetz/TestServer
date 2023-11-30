const mongoose = require("mongoose")
require("dotenv").config({path: "D:/PublishWebApps/InspireMe/.env"})

mongoose.connect(process.env.MONGODB_NEW_CONNECTION)

let groupSchema = new mongoose.Schema({
    group: String,
    chats: Array
})
let chatShema = new mongoose.Schema({
    chatGroup: String,
    chats: Array
})
// the userName and lastSeen are strings, last seen is a fullDate.
let lastSeenSchema = new mongoose.Schema({
    userName: String,
    lastSeen: String
})
let userRecordSchema = new mongoose.Schema({
    userName: String,
    groups: Array //arrays of strings
})
// needs the insert,update and find methods
let groupModel = mongoose.model("group",groupSchema)

// find data from a group
exports.findGroup = async function findGroup(data){
    let groups = await groupModel.find(data)
    return groups
}
// updates done in the native mongodb syntax
// this method works for both the $push and the $set
exports.updateGroup = async function updateGroup(data1,data2){
    // groupModel.updateOne()
    // the data should atleast be more specific since that would help
    await groupModel.updateMany(data1,data2)
}
// This method is the one called when adding a new group data for the first time
exports.insertGroup = async function insertItems(data){
    await groupModel.insertMany(data)
}

let chatModel = mongoose.model("chatGroups",chatShema)

exports.findChat = async function findChat(data){
    //data must be an object.
    let chatData = await chatModel.find(data)
    console.log(chatData.length)
    return chatData
}
// updates done in the native mongodb syntax
// this method works for both the $push and the $set
exports.updateChat = async function updateChat(data1,data2){
    // groupModel.updateOne()
    // the data should atleast be more specific since that would help
    await chatModel.updateMany(data1,data2)
}
// This method is the one called when adding a new group data for the first time
exports.insertChat = async function insertChat(data){
    await chatModel.insertMany(data)
}

// I need a third database for for keeping mere arrays of strings of documents that a particular user is in. 
// so that the groupNames can be displayed when the user signs in but then each particular set of data about the group. will need to be fetched in the other groups, or groupChat collections.
let userRecordModel = mongoose.model("userRecords",userRecordSchema)

exports.findRecords = async function findRecords(data){
    let records = await userRecordModel.find(data)
    return records
}
// updates done in the native mongodb syntax
// this method works for both the $push and the $set
exports.updateRecords = async function updateRecords(data1,data2){
    // groupModel.updateOne()
    // the data should atleast be more specific since that would help
    await userRecordModel.updateMany(data1,data2)
}
// This method is the one called when adding a new group data for the first time
// insert records only called once when the first userName is being created, all the other instances will simply be updates
exports.insertRecords = async function insertRecords(data){
    await userRecordModel.insertMany(data)
}

let lastSeenModel = mongoose.model("lastSeen",lastSeenSchema)
exports.findLastSeen = async function findLastSeen(data){
    let lastSeens = await lastSeenModel.find(data)
    return lastSeens
}
// updates done in the native mongodb syntax
// this method works for both the $push and the $set
exports.updateLastSeen = async function updateLastSeen(data1,data2){
    // groupModel.updateOne()
    // the data should atleast be more specific since that would help
    await lastSeenModel.updateMany(data1,data2)
}
// This method is the one called when adding a new group data for the first time
exports.insertLastSeen = async function insertLastSeen(data){
    await lastSeenModel.insertMany(data)
}

