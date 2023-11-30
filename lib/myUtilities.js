require("dotenv").config({path : "../.env"}) 
const messages = require("./messages2")


exports.daySetter = daySetter 
function daySetter(day){
    switch (day) {
        case 1 : 
            return "monday"
            break
        case 2 : 
            return "Tuesday"
            break
        case 3 : 
            return "wednesday"
            break
        case 4 : 
            return "Thursday"
            break
        case 5 : 
            return "friday"
            break
        case 6 : 
            return "saturday"
            break
        case  7: 
            return "sunday"
            break

    }    
}


exports.sorter = sorterfunction
function sorterfunction(a,b){
    let newA = a.time.split(".");
    let newB = b.time.split(".");
    
    let dateSorter = function(arr){
        let total = 0    
        let dateA = arr[0].split("/").map(numberMap)
        if(dateA[0]){
            total += dateA[0]
        }
        if(dateA[1]){
            total += dateA[1] * 31
        }
        if(dateA[2]){
            total += dateA[2] * 365
        }
        return total
    }
    let timeSorter = function(arr){
        let total = 0
        let timeA = arr[1].split(":").map(numberMap);
        if(timeA[0]){
            total += timeA[0] * 60 * 60 
        }
        if(timeA[1]){
            total += timeA[1] * 60
        }
        if(timeA[2]){
            total += timeA[2] 
        }
        return total
    }
    // to sort it ascending change the two diffs to work with A - B 
    // here it's in descending order
    let dateDiff = dateSorter(newB) - dateSorter(newA)
    let timeDiff = timeSorter(newB) - timeSorter(newA)
    if(dateDiff == 0){
        // meaning the days are equal.
        // so return the difference in time.
        return timeDiff
    }
        // meaning that dates have a difference and don't get into the time differences.
    else{
        return dateDiff
    }
}
function numberMap(value,index, array) {
    return Number(value)
}
exports.reverseSorter = reverseSorter
function reverseSorter(a,b){
    let newA = a.time.split(".");
    let newB = b.time.split(".");
    
    let dateSorter = function(arr){
        let total = 0    
        let dateA = arr[0].split("/").map(numberMap)
        if(dateA[0]){
            total += dateA[0]
        }
        if(dateA[1]){
            total += dateA[1] * 31
        }
        if(dateA[2]){
            total += dateA[2] * 365
        }
        return total
    }
    let timeSorter = function(arr){
        let total = 0
        let timeA = arr[1].split(":").map(numberMap);
        if(timeA[0]){
            total += timeA[0] * 60 * 60 
        }
        if(timeA[1]){
            total += timeA[1] * 60
        }
        if(timeA[2]){
            total += timeA[2] 
        }
        return total
    }
    // to sort it ascending change the two diffs to work with A - B 
    // here it's in descending order
    let dateDiff = dateSorter(newA) - dateSorter(newB)
    let timeDiff = timeSorter(newA) - timeSorter(newB)
    if(dateDiff == 0){
        // meaning the days are equal.
        // so return the difference in time.
        return timeDiff
    }
        // meaning that dates have a difference and don't get into the time differences.
    else{
        return dateDiff
    }
}


exports.groupsFormatter = groupsFormatter
async function groupsFormatter(groups,sender){
    let groupsFound = []
    // use constants mostly for objects that expect arrays and data objects. so that its maintains reference.

    //for each loops and maps failed me here terribly because of the asynchronous functions that I had to use so I opted for the traditional for loop.
    
    for(let i = 0; i < groups.length; i++){
        //for the groups                
        if(groups[i].indexOf(".") != -1){
            //ensure you also return latestChat with the groupName
            let actualGroupName = groups[i].split(".")
            let creator = actualGroupName[0]
            let receivedGroup = actualGroupName[1]
            let results = await messages.findGroup({$and: [{group: {$regex: `${creator}`}},{group: {$regex: `${receivedGroup}`}}]})
            let dbGroup = results[0].chats
            dbGroup.sort(sorterfunction)                    
            let latestChat = dbGroup[0].message
            let latestTime = dbGroup[0].time
            let latestUser = dbGroup[0].userName
            groupsFound.push({latestUser:latestUser,vGroup: groups[i],group: actualGroupName[1],lastChat: latestChat,time: latestTime,profileUrl: "http://127.0.0.1:4055/imageServingTest.jpg"})
        }
        //for the chats
        else if(groups[i].indexOf("-") != -1){
            let actualGroupName = groups[i].split("-")
            let firstPart = actualGroupName[0]
            let secondPart = actualGroupName[1]
            let results = await messages.findChat({$and: [{chatGroup: {$regex: `${firstPart}`}},{chatGroup: {$regex: `${secondPart}`}}]})
            let dbGroup = results[0].chats
            dbGroup.sort(sorterfunction)
            let latestChat = dbGroup[0].message
            let latestTime = dbGroup[0].time
            let latestUser = dbGroup[0].userName
            let finalUser;
            actualGroupName.forEach(function(value,index){
                if(value != sender){
                    finalUser = value
                }
            })
            groupsFound.push({latestUser:latestUser,vGroup: groups[i],group: finalUser,lastChat: latestChat,time: latestTime,profileUrl: "http://127.0.0.1:4055/imageServingTest.jpg"})
        }
    }
    return groupsFound
}

exports.singleGroupFormatter = singleGroupFormatter

async function singleGroupFormatter(group,sender){
    let groupFound
    // use constants mostly for objects that expect arrays and data objects. so that its maintains reference.

    //for each loops and maps failed me here terribly because of the asynchronous functions that I had to use so I opted for the traditional for loop.
    //for the groups                
    if(group.indexOf(".") != -1){
        //ensure you also return latestChat with the groupName
        let actualGroupName = group.split(".")
        let creator = actualGroupName[0]
        let receivedGroup = actualGroupName[1]
        let results = await messages.findGroup({$and: [{group: {$regex: `${creator}`}},{group: {$regex: `${receivedGroup}`}}]})
        let dbGroup = results[0].chats
        dbGroup.sort(reverseSorter)                    
        groupFound = {vGroup: group,group: receivedGroup,chats: dbGroup,profileUrl: "http://127.0.0.1:4055/imageServingTest.jpg"}
    }
    //for the chats
    else if(group.indexOf("-") != -1){
        let actualGroupName = group.split("-")
        let firstPart = actualGroupName[0]
        let secondPart = actualGroupName[1]
        let results = await messages.findChat({$and: [{chatGroup: {$regex: `${firstPart}`}},{chatGroup: {$regex: `${secondPart}`}}]})
        let dbGroup = results[0].chats
        dbGroup.sort(reverseSorter)
        let finalUser;
        actualGroupName.forEach(function(value,index){
            if(value != sender){
                finalUser = value
            }
        })
        groupFound = {vGroup: group,group: finalUser,chats: dbGroup,profileUrl: "http://127.0.0.1:4055/imageServingTest.jpg"}
    }
    return groupFound
}

// works in an array map. and works with the fullDates also it compares the  full dates and the data and if they are the same stores only one particular set of that data, and removes all the rest
exports.stainRemover = function(array,index){

}