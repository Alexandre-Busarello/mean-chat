var Mongoose = require('mongoose');

exports.UserSchema = new Mongoose.Schema({
  name : { type : String, required : true },
  login : { type : String, required : true },
  password : { type : String, required : true }
});