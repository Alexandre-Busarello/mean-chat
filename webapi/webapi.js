var userApi = require('./users.js');
var roomsApi = require('./rooms.js');

exports.initialize = function(app) {
    userApi.initialize(app);
	roomsApi.initialize(app);
};

