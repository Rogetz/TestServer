const mongoose = require("mongoose")
require("dotenv").config({path: "../.env"})

mongoose.connect(process.env.MONGODB_OLD_CONNECTION)

//commonjs export
exports.mongoose = mongoose


let userSchema = new mongoose.Schema({
    userName: String,
    gmail: String,
    linkedIn : String,
    githubFollowers : Number,
    githubFollowing: Number,
    githubBadgesEarned: Number,
    noOfRepos : Number,
    githubStars : Number,
    // everything from github will be directly fetched from github
    githubStats : {

    },
    githubprofilePic : Boolean,
    likes : Number,
    comments : Number
})

let usersModel = mongoose.model("users",userSchema)

// all db methods need to be wrapped inside functions
// note that the data parameter can only be a single object t any specific time for the sake of uniformity.
function usersInsert(data){
    // note that this is insertMany and it mostly takes an array
    // Its taking a single document however each time
    return usersModel.insertMany([data])
}

// for the many users,used by admins(me)
function usersFind(){
    return usersModel.find()
}

// for a single user.
function userFind(data){
    return usersModel.find(data)
}

//creating a method for saving anything,from any model.
