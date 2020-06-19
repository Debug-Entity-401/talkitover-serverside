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
io.on('connection',socket=>{
  console.log('socket connection');
  socket.emit('message','welcome to talkitover');
  //it will emit expect cureent user
  socket.broadcast.emit('message','a new user has joined the chat');
  socket.on('disconnect',()=>{
    //emmit to all clients expect the curent user
    io.emit('message','a user has left the channel');
  });
  socket.on('chatmessage',(message)=>{
    io.emit('message',message);
  });
 
});
module.exports = {
  server: app,
  start: (port) => {
    server.listen(port, () => { console.log(`Listening on port ${port}`); });
  },
};