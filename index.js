var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/game.html');
});

io.on('connection', function(socket){
	socket.broadcast.emit('chat message', 'user connected: '+socket.id);
	console.log('a user connected');

	socket.on('disconnect', function(){
		socket.broadcast.emit('chat message', 'user disconnected: '+socket.id);
		console.log('user disconnected');
	});

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
		console.log('message: '+msg+' -' + (socket.username || socket.id));
	});

	socket.on('set username', function(username){
		socket.username = username;
		console.log('new name: '+socket.id+' => '+username);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
