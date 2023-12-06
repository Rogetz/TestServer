const {Server} = require("socket.io")
const jwt = require("jsonwebtoken")
require("dotenv").config({path : "./.env"}) 
const luxon = require("luxon")


// do note that this socket server will leave the task of storing the chat data to the database and by the other graphql api, this one will only be in charge of sending texts, one on one that is a
const socketServer = new Server({
    cors: {
        allowedHeaders : ["Access-Control-Allow-Origin"]
    }
})// another way of initializing it.

// an map of usersOnline with the userName keu and the socket value
// very useful for emitting users online in a group
// useful for accessing sockets using their userNames
const usersOnline = new Map()

const userNamesOnline = []
let groupsAttachedTo = []

// data for each users sockets and doesn't need a db for now since It will be changing from time and I'll be deleting inactive sockets.
let userSockets = new Map() // Identify by their userNames.

let serverPort = 80
// I've added a middleware for testing for some auth data.
// called once when the socket connects.
// Note that I can also add middleware to each socket in the case of preventing access to some events by unauthorized sockets.
// ensure you call next in any case else the connection will be left hanging.

// note that this event is not called if it fails in  the middleware section
socketServer.on("connection",function(socket){
    console.log("socket connection validated and accepted")
})


socketServer.listen(serverPort)
console.log(`socket server created and listening at port: ${serverPort}`)





