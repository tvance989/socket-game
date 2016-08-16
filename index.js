var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/game.html');
});

var num_clicks = 0;
var clicks = {};

io.on('connection', function(socket){
	socket.emit('set button', num_clicks);
	clicks[socket.id] = 0;
	console.log('a user connected');

	socket.on('button click', function(){
		num_clicks++;
		io.emit('set button', num_clicks);

		clicks[socket.id]++;
		io.emit('debug', clicks);

		console.log('button clicked. '+num_clicks+' total.');
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
		delete clicks[socket.id];
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
