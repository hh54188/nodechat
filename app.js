var express = require('express')
	,io = require('socket.io'); 

var app = express()
  , server = require('http').createServer(app)
  , io = io.listen(server);

  io.set('log level', 0);
  
  server.listen(8000);

io.sockets.on('connection', function (socket) {
  // trigger the client
  console.log('server--->have client!');
  // console.log('server--->trigger [news] event!');
  // socket.emit('news', { hello: 'world' });

  // recevied the event
  // socket.on('message', function (data) {
  //   console.log('server---> [message] event triggered!');
  //   console.log(data);
  // });
  io.sockets.on('connection', function (socket) {

    socket.on('set name', function (name) {
      socket.set('name', name, function () { 
        console.log(name + " joined!");
      });
    });

    socket.on('send msg', function (data) {
      console.log(data);
      console.log('Char message is ' + data.content);
      console.log('Chat message by ' + data.from);
      socket.emit('receive msg', data);
      
      // name list check      
      // socket.get('name', function (err, data) {
      //   console.log(data);
      // });
    });

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

