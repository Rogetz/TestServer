// Note that however tp avoid complexity I've decided to just make this as an interface such that for each database I am using I must implement this, I do realize that there might be some changes depending on the kind of database I am using.

// all functions should accept an object that has the collection name/rather the model name in the case of mongoose./table name in the case of mysql and other relational databases.

// the object has two parts, the actual contents that need to be sent to the database,and two, the collection or modelName or table name
exports.create = function create(obj){

}
// takes only the collection name from the object parameter,since it needs no payload
exports.read = function read(obj){

}
exports.update = function update(obj){

}
exports.del = function del(obj){

}