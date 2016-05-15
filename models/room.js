var Mongoose = require('mongoose');

exports.RoomSchema = new Mongoose.Schema({
  name : { type : String, required : true },
  description : { type : String, required : true },
  messages : []
});