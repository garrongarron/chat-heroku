var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);
global.nUsers = 0;
var users = [];
app.use(express.static('client'));

server.listen(PORT, function() {
  console.log('Chat server running');
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  socket.on('message', function(msg) {
    io.emit('message', msg);
  });


  
  socket.on('add user', function(username) {
    socket.addedUser = false;
    console.log(username)
    socket.username = username;
    users[username] = username;
    ++nUsers;
    socket.addedUser = true;
    socket.emit('login', {numUsers:nUsers});
    //broadcast
    socket.broadcast.emit('user joined',{
      username: socket.username,
      numUsers: nUsers,
    });
  });
  
  socket.on('new message', function(msg) {
    //broadcast
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: msg,
    });
  });

  socket.on('typing', function(msg) {
    //broadcast
    socket.broadcast.emit('typing',{username:socket.username});
  });

  socket.on('stop typing', function(msg) {
    //broadcast
    console.log(socket.username, 39);
    socket.broadcast.emit('stop typing', {username:socket.username});
    //io.emit('message', 'asd');
  });

  socket.on('disconnect', function(msg) {
    //broadcast
    if(socket.addedUser ){
      console.log(msg,socket.username,65)
      delete users[msg];
    }
    --nUsers;
    io.emit('user left', {
      username: socket.username,
      numUsers: nUsers,
    });
  });


});
