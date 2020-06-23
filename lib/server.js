'use strict';
require('dotenv').config();
const jwt=require('jsonwebtoken');
const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const morgan = require('morgan');
const cors = require('cors');
var cookieParser = require('cookie-parser');
const bearerAuth = require('../middleware/bearer-auth');
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
const { decode } = require('punycode');
const { resolveSoa } = require('dns');

app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(fBOauth);
app.use(articleRoutes);
app.use(reviewsRoutes);
app.use(router);
let user = { users: {} };
// var newuser;
// app.get('/chat', (req, res) => {
//   let username = req.headers.cookie.split('=');
//   console.log('okkkkkkkkkkkkk',username);
//   return jwt.verify(username[1], process.env.SECRET, async function (err, decoded) {
//     let decodedusername = decoded.user_name;
//     console.log('token username', decodedusername);
//     newuser=decodedusername;
//     res.redirect('/chat'); 
//   });
// });

///////////////////////////////////////////////////
let rooms = {};
let role= [] ;
app.get('/',(req,res)=>{
  res.render('index');
});
app.get('/chat', bearerAuth, (req,res)=>{  ///use id the post as room 
  // let newRoom = req.params.room;
  let newRoom = 'chat';
  if (rooms[newRoom] === null) {
    return res.redirect('/');
  }
  rooms[newRoom] = newRoom;//{chat: chat}
  let username = req.cookies['remember token'];
  return jwt.verify(username, process.env.SECRET, async function (err, decoded) {
    let decodedusername = decoded.user_name;
    role.push(decoded.role);
    res.render('chat', { roomName: newRoom, name: decodedusername});
  });
});



//////////////////////////////////////////////////

// const chatServer = io.of('/chat'); //1. create a namespace
const max_connections = 2;
let current_connections = 0;
// io.on('connection', socket => { //2. when a client connects to the server, it will have a connection
///////////////////////////////////////////////////////////////////new

io.on('connection', socket => {
  socket.on('new-user', (room, name) => {
    //u cant enter if the user more than two
    // if(role.length == 2 && role[0] === role[1]){
    //   role.pop();
    //   socket.emit('disconnected', 'You cannot enter the room');
    //   socket.disconnect(true);
    // }
    rooms[room]= user; //{chat:{users:{}}}
    let users = rooms[room]= user;
    rooms[room].users[socket.id] = name;
    current_connections++; //3
    if (current_connections > max_connections) {
      socket.emit('disconnected', 'Sorry. room is full.');
      socket.disconnect(true);
    } else {
      socket.on('disconnect', function () {
        current_connections--;
        socket.leave(room);
        delete users[socket.id];
      });
      socket.join(room);
      socket.to(room).broadcast.emit('user-connected' ,name);
    }
    ///limit user
    
  
    socket.on('send-chat-message', (room, message) => {
      socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] });
    });
    
    // socket.on('disconnect', () => {
  
    //     getUserRooms(socket).forEach(room => {
    //       socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id]);
    //       delete rooms[room].users[socket.id];
    //     });
    //   });
  });
});
// function getUserRooms(socket) {
//   return Object.entries(rooms).reduce((names, [name, room]) => {
//     if (room.users) {
//       if (room.users[socket.id] != null) names.push(name);
//       return names;
//     }}, []);
// }



////////////////////////////////////////////////////////////////////new
/*
  socket.on('joinRoom', (room,name) => {//start join
    //4. recieve the name of the room from the client

    socket.join(room);

    console.log('alaaaaalmasri', room);
    //5. connect to the room
    socket.emit('joinRoom', room); //6. to print the roon name that the client joined
    socket.on('message', (payload) => {  //9. to get the sent msg payload 
      console.log('ayyyyyyyyyy', name);
      //10. emitting to everyone in the room including the sender (send the msg payload to all the client in the room)
      io.in(room).emit('message', `${name}: ${payload}`);
    });//message
  });/// end join 
});
*/
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