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
//////////////////////////


///////////////////////
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



///////////////////////////////////////////////////


let user = { users: {} };
let number = 0;
let rooms = {};


//////////////////////////////////////////////////


io.on('connection', socket => {
  console.log('<----user connected---->');
  socket.on('new-user', (obj) => {
    socket.on('disconnect', () => {
      console.log('when back ===>');
      delete rooms[obj.room].users[socket.id];
            
    });
        

    if (Object.keys(rooms).includes(obj.room)) {
      let count = 0;
      Object.keys(rooms[obj.room].users).forEach(key => {
        if (obj.role === rooms[obj.room].users[key].role) {
          socket.emit('full-room', 'Room is full.');
          count++;
          socket.disconnect(true);
        }
      });
      if (count === 0)
        rooms[obj.room].users[socket.id] = { name: obj.name, role: obj.role };
    } else {
      user = { users: {} };
      rooms[obj.room] = user;//{chat:{user:pppp:sondos2},{numberofUser:2}}
      rooms[obj.room].users[socket.id] = { name: obj.name, role: obj.role };
    }
    console.log('roooms obj ====> ', rooms);
    let numberOfUsers = Object.keys(rooms[obj.room].users);
    if (numberOfUsers.length > 2) {
      socket.emit('full-room', 'Room is full.');
      socket.disconnect(true);
    }
    else {
      socket.on('disconnected', function () {
        rooms[obj.room].numberOfuser = number--;
        socket.leave(obj.room);
        socket.to(obj.room).broadcast.emit('user-disconnected', { name: obj.name, message: 'disconnected' });
        delete rooms[obj.room].users[socket.id];
      });


      socket.join(obj.room);
      socket.to(obj.room).broadcast.emit('user-connected', obj.name);
    }
    socket.on('send-chat-message', (payload) => {
      socket.to(obj.room).broadcast.emit('chat-message', { message: payload.message, name: rooms[obj.room].users[socket.id].name });
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