'use strict';
require('dotenv').config();
const jwt=require('jsonwebtoken');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const morgan = require('morgan');
const cors = require('cors');
var cookieParser = require('cookie-parser');
// const bearerAuth = require('../middleware/bearer-auth');
app.set('views','./views');
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
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
let user = { users: {} };


///////////////////////////////////////////////////
let rooms = {};
let role= [] ;
app.get('/',(req,res)=>{
  res.render('index');
});

// bearerAuth,
app.get('/chat', (req,res)=>{  ///use id the post as room 
  // let newRoom = req.params.room;
  let newRoom = 'chat';
  if (rooms[newRoom] === null) {
    return res.redirect('/');
  }
  rooms[newRoom] = newRoom;
  let username = req.cookies['remember token'];
  return jwt.verify(username, process.env.SECRET, async function (err, decoded) {
    let decodedusername = decoded.user_name;
    role.push(decoded.role);
    res.render('chat', { roomName: newRoom, name: decodedusername});
  });
});



//////////////////////////////////////////////////


const max_connections = 2;
let current_connections = 0;

io.on('connection', socket => {
  socket.on('new-user', (room, name) => {
    if(role.length == 2 && role[0] === role[1]){
      role.pop();
      socket.emit('disconnected', 'You cannot enter the room');
      socket.disconnect(true);
    }
    rooms[room]= user; 
    rooms[room].users[socket.id] = name;
    current_connections++; 
    if (current_connections > max_connections) {
      socket.emit('disconnected', 'Sorry. room is full.');
      socket.disconnect(true);
    } else {
      socket.on('disconnect', function () {
        current_connections--;
        socket.leave(room);
        socket.to(room).broadcast.emit('user-disconnected' ,`${name} disconnected `);
        delete rooms[room].users[socket.id];
      });
      socket.join(room);
      socket.to(room).broadcast.emit('user-connected' ,name);
    }
    socket.on('send-chat-message', (room, message) => {
      socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] });
    });
  });
});
///////////////////////////////////////////////////////////////////
////handle errors
//404 errors
app.use('*', notFoundError);
//500 errors
app.use(serverError);
module.exports = {
  server: app,
  start: (port) => {
    server.listen(port, () => { console.log(`Listening on port ${port}`); });
  },
};