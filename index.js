var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/game.html');
});

var num_clients = 0;
var num_clicks = 0;

io.on('connection', function(socket){
	console.log('a user connected');
	io.emit('num clients', ++num_clients);

	socket.emit('num clicks', num_clicks);

	socket.on('button click', function(){
		io.emit('num clicks', ++num_clicks);
		console.log('button clicked. '+num_clicks+' total.');
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
		io.emit('num clients', --num_clients);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
