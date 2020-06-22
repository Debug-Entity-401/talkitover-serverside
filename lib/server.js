'use strict';

////require
//external packages and modules
require('dotenv').config();
const express = require('express'); 
const app = express();
const cors = require('cors');
const morgan = require('morgan');
let io = require('socket.io')(3030); /// add socket.io


//internal modules
const router = require('../src/router');
const signUpRouter = require('../src/routs/signin');
const signInRouter = require('../src/routs/signup');
const signOutRouter = require('../src/routs/signout');
const fBOauth = require('../src/routs/facebookauth');
const articleRoute = require('../src/articles-qoutes');

//error middleware
const notFoundError = require('../middleware/errors/404');
const serverError = require('../middleware/errors/500');

////////////////////////////////

////global middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('./public'));

////////////////////////////////

////handle routes
app.get('/', (req, res) => {
  res.status(200).send('Welcome To Talkitover! Server\'s Up And Running..');
});

app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(fBOauth);
app.use(articleRoute);
app.use(router);

////////////////////////////////
////////////////////////////////
//////chat


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
      //10. emitting to everyone in the room including the sender (send the msg payload to all the client in the room)
      chatServer.in(room).emit('message', payload);
    });
  });
});

///////////////////////////////
////////chat





////handle errors
//404 errors
app.use('*', notFoundError);
//500 errors
app.use(serverError);

////////////////////////////////

module.exports = {
  server: app,
  start: (port) =>{
    const PORT = port || process.env.PORT;
    app.listen(PORT, () => console.log(`Listening On Port: ${PORT}\n`));
  },
};

