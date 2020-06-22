'use strict';
const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketio=require('socket.io');
const io=socketio(server);
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const morgan = require('morgan');
app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));
//when client connects
// io.on('connection',socket=>{
//   console.log('socket connection');
//   socket.emit('message','welcome to talkitover');
//   //it will emit expect cureent user
//   socket.broadcast.emit('message','a new user has joined the chat');
//   socket.on('disconnect',()=>{
//     //emmit to all clients expect the curent user
//     io.emit('message','a user has left the channel');
//   });
//   socket.on('chatmessage',(message)=>{
//     io.emit('message',message);
//   });
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
      current_connections++;
      socket.on('disconnect', function () {
        current_connections--;
      });
    }
    socket.join(room);
    console.log('alaaaaalmasri',room);
     //5. connect to the room
    socket.emit('joinRoom', room); //6. to print the roon name that the client joined
    socket.on('message', (payload) => {  //9. to get the sent msg payload 
      console.log('ayyyyyyyyyy',payload);
      //10. emitting to everyone in the room including the sender (send the msg payload to all the client in the room)
      io.in(room).emit('message', payload);
    });
  });
});
module.exports = {
  server: app,
  start: (port) => {
    server.listen(port, () => { console.log(`Listening on port ${port}`); });
  },
};