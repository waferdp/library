var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

module.exports.UserModel =  function (dbConnection) {
    return dbConnection.model('User', UserSchema)
};