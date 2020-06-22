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
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const morgan = require('morgan');
app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));
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
app.get('/chat', (req, res) => {
  let username = req.headers.cookie.split('=');
  console.log('okkkkkkkkkkkkk',username);
  return jwt.verify(username[1], process.env.SECRET, async function (err, decoded) {
    let decodedusername = decoded.user_name;
    console.log('token username', decodedusername);
    newuser=decodedusername;
    res.redirect('/chat'); 
  });
});

const chatServer = io.of('/chat'); //1. create a namespace
const max_connections = 2;
let current_connections = 0;
io.on('connection', socket => { //2. when a client connects to the server, it will have a connection
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
    socket.join(room);  //5. connect to the room
    socket.emit('joinRoom', room); //6. to print the roon name that the client joined
    socket.on('message', (payload) => {  //9. to get the sent msg payload 
      console.log('ayyyyyyyyyy', newuser);
      //10. emitting to everyone in the room including the sender (send the msg payload to all the client in the room)
      io.in(room).emit('message', `${newuser}: ${payload}`);
    });
  });
});

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