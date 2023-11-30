// here I need to create a table of all user credentials
// This are the email address, the name and the password 

// Secondly I need a way of checking or rather selecting particular user data to see is the records of a particular user actually exist, if so match the password provided with the password stored and thats all.

const sqlite3 = require("sqlite3").verbose()
const md5 = require("md5")
const dotenv = require("dotenv")
dotenv.config()
// md5 the password to compare first before passing it on to the values to insert


const databaseToUse = process.env.DATABASE

module.exports = userToHandle

function userToHandle(user){
    for(var key in user){
        this[key] = user[key]
    }
}

// the OPEN_CREATE flag creates the databse if it does not already exist incase it doesn't do this in the render server I'll do it myself
//however it is passed by default to this function
// somehow if you run this independently it seemd like it has no access to the .env directory so you have to pass the string directly, but in the actual application its safe to call it directly.
let db = new sqlite3.Database("shouty.db",function(err){
    if(err){
        console.log("error while accesing database:")
        console.log(err)
    }
    else{
        console.log("connected to the sqlite database")
        // we simply do the operations of the db inside this else block, its as if we are in the actual db
        // remeber that here we set the password to start with small letters
        db.run(`CREATE TABLE user( Email text,Name text, password text,CONSTRAINT email_unique UNIQUE (Email))`,function(err){
            if(err){console.log("error while creating user table, might be existing")}
            else{
                console.log("table created successfuly")
            }
        })
    }
})

userToHandle.prototype.signUp = function(fn){
    let user = this
    let hashedPassword = md5(user.Password)
    user.Password = hashedPassword;

    // test if the user exists first.
    var searchquery = `SELECT * FROM user WHERE Email = ?`
    db.get(searchquery,user.Email,function(err,row){
        if(err){
            console.log("no user as such exists")
            //fn(err,null)// after we've found that thers's no user as such we still need not return anything
        }
        else{
            if(row != null){
                console.log("user already exists, redirect to the login page")
                fn(null,user)
            }
            else{
                console.log("no user as such exists")
            }
        }
    })    

    //this is a prepared statement
    var insertCommand = `INSERT INTO user(Email,Name,Password) VALUES(?,?,?)`
    let userDataArray = [user.Email,user.Name,user.Password]
    //this are values from the user login form
    if(user != null){
        db.run(insertCommand,userDataArray,function(err){
            if(err){console.log("user already exists")}
            else{
                console.log("succesfuly registered redirected to login")
                fn(null,user)
            }
        })
    }
}
userToHandle.updatePassword = function(Email,newPassword,fn){
    //find a way of including the newPassword inside the query
    let newHashed = md5(newPassword)
    let updateQuery = `UPDATE user SET Password = ? WHERE Email = ?`
    db.run(updateQuery,newHashed,Email,function(err){
        if(err){
            console.log("an error occured during update of elements")
            fn("error during update",null)
        }
        else{
            console.log("Email updated successfuly")
            fn(null,"successfuly changed")
        }
    })
}

// This is what is to be used by the passport login authentication
userToHandle.prototype.logIn = function(fn){
    let user = this
    console.log(user.Password)
    console.log(user.Email)
    let hashedPassword = md5(user.Password)
    user.Password = hashedPassword;
    console.log(user.Password)
    var searchquery = 'SELECT * FROM user WHERE Email = ?'
    console.log(user.Email)
    // note that the db.all returns a rows value, containing all the rows from which you can query from
    // the get method however returns only a single row so I'll use it here since I dont exepect more than two emails repeated
    //db.all(searchquery,EmailToCompare,function(err,rows){})
    db.get(searchquery,user.Email,function(err,row){
        if(err){
            console.log("error retrieving the email data")
            fn(err,null)
        }
        else{
            // it returns undefined if there's no data
            if(row != undefined){
                console.log(row)
                // you can then acccess the individual row fields
                let validationPassword = row.password // compare if the password provide matches
                console.log(validationPassword)
                if(validationPassword != undefined){
                    if(user.Password === validationPassword){
                        console.log("user valid redirect to the required next field")
                        fn(null,user)
                    }
                    else{
                        console.log("Invalid password")
                        fn("invalid password",null)
                    }
                }
                else{
                    fn("no password data returned",null)
                }

            }
            else{
                fn("inexistance",null)
            }
        }
    })
}

// check it later
//let actualUser = new userToHandle({Email: "cHAPO",Name: "Tommy",Password : "test57"})
/*actualUser.signUp(function(err,mess){
    if(err){
        console.log(err)
    }
    else{
        console.log(mess)
    }
})*/
/* For the tests which worked perfectly well.*/
/*actualUser.logIn(function(err,message){
    if(err){
        console.log(err)
    }
    else{
        console.log(message)
        console.log("user's email is: "+message.Email)
    }
})*/