var express = require('express')
	,io = require('socket.io'); 

var app = express()
  , server = require('http').createServer(app)
  , io = io.listen(server);
  
  server.listen(8000);

io.sockets.on('connection', function (socket) {
  // trigger the client
  console.log('--->have client!');
  console.log('--->trigger news event!');
  socket.emit('news', { hello: 'world' });

  // recevied the event
  socket.on('client_event', function (data) {
    console.log('---> trigger by the event', data);
  });
});

//boot
app.configure(function () {
	app.use(express.static(__dirname + "/media"));
	app.use(express.bodyParser());
	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/views');
})


//router
app.get('/', function (req, res) {
	res.render('client');
});

