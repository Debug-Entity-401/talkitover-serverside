'use strict';
require('dotenv').config();
const jwt = require('jsonwebtoken');
const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const morgan = require('morgan');
app.use(express.static('public'));
let ejs = require('ejs');
app.use(cors());
app.use(morgan('dev'));
app.set('views', './views');
app.set('view engine', 'ejs');
//internal modules
const router = require('../src/router');
const signUpRouter = require('../src/routs/signin');
const signInRouter = require('../src/routs/signup');
const signOutRouter = require('../src/routs/signout');
const fBOauth = require('../src/routs/facebookauth');
const articleRoutes = require('../src/articles-qoutes');
const reviewsRoutes = require('../src/routs/reviewes');

//error middleware
const notFoundError = require('../middleware/errors/404');
const serverError = require('../middleware/errors/500');

app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(fBOauth);
app.use(articleRoutes);
app.use(reviewsRoutes);
app.use(router);
var newuser;
const rooms ={};

app.get('/:chat', (req, res) => {
  let username = req.headers.cookie.split('=');
  return jwt.verify(username[1], process.env.SECRET, async function (err, decoded) {
    let decodedusername = decoded.user_name;
    newuser = decodedusername;
    res.render('chats', { room: req.params.chat, name: newuser });
  });
});

const chatServer = io.of('/chat'); //1. create a namespace
const max_connections = 2;
let current_connections = 0;
io.on('connection', socket => { //2. when a client connects to the server, it will have a connection
  console.log('hiiiiiiiiii');
  socket.on('joinRoom', room => {
    //4. recieve the name of the room from the client
    if (current_connections >= max_connections) {
      socket.emit('disconnected', 'Sorry. room is full.');
      socket.disconnect(true);
    } else {
      console.log('alaaaa');
      current_connections++;
      socket.on('disconnect', function () {
        current_connections--;
      });
    }
    socket.on('new user',(room,name)=>{
      socket.join(room); 
      rooms[room].users[socket.id] = name;
      socket.to(room).broadcast.emit('user-connected', name);
    });
    //5. connect to the room
    socket.emit('joinRoom', room); //6. to print the roon name that the client joined
    socket.on('message', (room,payload) => {  //9. to get the sent msg payload 
      console.log('ayyyyyyyyyy', newuser);
      //10. emitting to everyone in the room including the sender (send the msg payload to all the client in the room)
      io.in(room).emit('message', { message: payload, name: rooms[room].users[socket.id] });
    });
    socket.on('disconnect', () => {
      getUserRooms(socket).forEach(room => {
        socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id]);
        delete rooms[room].users[socket.id];
      });
    });
  });
});
function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}


////handle errors
//404 errors
app.use('*', notFoundError);
//500 errors
app.use(serverError);
module.exports = {
  server: app,
  start: (port) => {
    const PORT = port || process.env.PORT;
    app.listen(PORT, () => console.log(`Listening On Port: ${PORT}\n`));
  },
};