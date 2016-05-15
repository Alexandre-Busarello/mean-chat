var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var reload = require('reload');
var http = require('http');
var cons = require('consolidate');
var webapi = require('./webapi/webapi.js');
var basicAuth = require('basic-auth');

app = express();
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/public/javascript'));
app.use(bodyParser.json());

var auth = function (req, res, next) {
	var user = basicAuth(req);
	if (!user || !user.name || !user.pass) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		res.sendStatus(401);
		return;
	}

	var mongoService = require('./services/mongoService.js');
	var User = mongoService.User;  
  
	console.log(user.name);
	console.log(user.pass);
	User.findOne({login: user.name, password: user.pass}, function(err, u) {
		console.log(u);
		if (u) {
			next();
		} else {
			res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
			res.sendStatus(401);
			return;	
		}
	});		  
}

app.get('/', function(req, res) {
    res.render('login');
});

app.get('/rooms', auth, function(req, res) {
	var credentials = new Buffer(req.headers.authorization.split(' ')[1], 'base64');
	var credentialsSplit = credentials.toString('ascii').split(':');
	
	global.username = credentialsSplit[0];
	global.password = credentialsSplit[1];
	
    res.render('rooms');
});

webapi.initialize(app);

app.get('*', function(req, res){
  res.render('404');
});

var server = http.Server(app);
var io = require('socket.io').listen(server);
reload(server, app, 300, true);

server.listen(app.get('port'), function() {
  console.log('Node mean-chat running on port ', app.get('port'));
});

io.sockets.on('connection', function (socket) {
	socket.on('adduser', function(room){
		console.log('adduser - ' + global.username + ' - ' + room);
		socket.username = global.username;
		socket.room = room;
		socket.join(room);
		socket.emit('updatechat', global.username, ' Você conectou na sala');
		socket.broadcast.to(room).emit('updatechat', 'SERVER', global.username + ' conectou nesta sala');
	});	
	
	socket.on('sendchat', function (data) {
		console.log(data);
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});	
	
	socket.on('disconnect', function(){
		console.log(socket.username + ' desconectou da sala');
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' desconectou da sala');
		socket.leave(socket.room);
	});	
});


