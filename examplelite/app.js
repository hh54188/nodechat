var express = require('express')
	,io = require('socket.io'); 

var app = express()
  , server = require('http').createServer(app)
  , io = io.listen(server);

  io.set('log level', 0);
  
  server.listen(8000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var usernames = {};

// event list:
// add user
// updatechat
// sendchat (in room)
// disconnect

io.sockets.on('connection', function (socket) {
	socket.on('adduser', function(username){
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = 'room1';
		
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room 1
		socket.join('room1');

		socket.emit('updatechat', 'SERVER', 'you have connected to room1');
		socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
	});

	// the client send message
	socket.on('sendchat', function (data) {
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});

	socket.on('disconnect', function(){
		delete usernames[socket.username];
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});