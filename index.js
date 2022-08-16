//Node server which will handle IO Socket connections
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var port = process.env.PORT || 8000;

http.listen(port, () => console.log(`Server is listening on port ${port}`));

const formatMessage = require('./public/message');
const {userJoin, getCurrentUser, deleteUser} = require('./public/users');

var io = require('socket.io')(http, {
    cors: {
        origin:"*"
    }
});

app.use(express.static(__dirname+'/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log('A user connected');

  //Whenever user joins the chat
  socket.on('joinRoom', ({username, room}) =>{

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit('joinedChat', `Happy Chatting! ${String.fromCodePoint(0x1F600)}`);

    socket.broadcast.to(user.room).emit('user-joined',username);
  })

  
  socket.on('send', message =>{
    const user = getCurrentUser(socket.id);
    const msg = formatMessage(user.username, message);
    socket.broadcast.to(user.room).emit('receive', msg);
  });

  socket.on('disconnect', message =>{
    const user = getCurrentUser(socket.id);
    if(user){
      socket.broadcast.to(user.room).emit('left',formatMessage(user.username, message));
      deleteUser(user.id);
    }
  });
});

