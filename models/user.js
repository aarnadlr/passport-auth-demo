var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});


// Injects our UserSchema with PassportLocal Mongoose METHODS:
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);