require('dotenv').config();

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect("mongodb://"+process.env.DB_USER+":"+process.env.DB_PASS+"@"+process.env.DB_HOST);
// create a schema for chat
var ClickSchema = mongoose.Schema({
	created: Date,
	username: String
});
// create a model from the chat schema
var Click = mongoose.model('Click', ClickSchema);
// allow CORS
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});

app.use('/bower_components',	express.static(__dirname + '/bower_components'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/game.html');
});

var num_clients = 0;
var num_clicks = 0;

io.on('connection', function(socket){
	console.log('a user connected');
	io.emit('num clients', ++num_clients);

	Click.count({}, function(err, c) {
		num_clicks = c;
		socket.emit('num clicks', num_clicks);
	});

	socket.on('button click', function(){
		io.emit('num clicks', ++num_clicks);
		console.log('button clicked. '+num_clicks+' total.');

		var newClick = new Click({created: new Date(), username: socket.id});
    //Call save to insert the chat
    newClick.save(function(err, savedClick) {
      console.log(savedClick);
    });
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
		io.emit('num clients', --num_clients);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
