var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://admin:aa03070812@ds045704.mongolab.com:45704/teste');

var UserSchema = require('../models/user.js').UserSchema;
var User = db.model('User', UserSchema, 'users');

var RoomSchema = require('../models/room.js').RoomSchema;
var Room = db.model('Room', RoomSchema, 'rooms');

exports.User = User;
exports.Room = Room;


