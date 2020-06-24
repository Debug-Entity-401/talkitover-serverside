'use strict';
// const express = require('express');
// const app = express();
// const http = require('http').createServer(app);
let io = require('socket.io')(3030);
const chatServer = io.of('/chat'); //1. create a namespace

const max_connections = 2;
let current_connections = 0;
chatServer.on('connection',socket =>{ //2. when a client connects to the server, it will have a connection
  socket.on('joinRoom',room =>{  //4. recieve the name of the room from the client
    if (current_connections >= max_connections) {
      socket.emit('disconnected', 'Sorry. room is full.');
      socket.disconnect(true);
    } else {
      current_connections++;
      socket.on('disconnect', function () {
        current_connections--;   
      });
    }
    socket.join(room);  //5. connect to the room
    socket.emit('joinRoom',room); //6. to print the roon name that the client joined
    socket.on('message', (payload) => {  //9. to get the sent msg payload 
      // console.log(payload);
      //10. emitting to everyone in the room including the sender (send the msg payload to all the client in the room)
      chatServer.in(room).emit('message', payload);
    });
    // socket.on('token',token =>{
    //   chatServer.in(room).emit('token',token);
    //   socket.handshake.query.name; //from header
    // });
  });
});


