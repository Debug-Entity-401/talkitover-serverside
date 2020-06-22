'use strict';

const io = require('socket.io-client');
const inquirer = require('inquirer');
const chat = io.connect('http://localhost:3030/chat',({query:'token=user-token'})); //to take the token from header

const room = 'Private Chat Room';

chat.emit('joinRoom', room);  //3. send the room name to the server
chat.on('joinRoom', room => {
  console.log(room);

});  //7. print the room name 

chat.on('disconnected', (msg) => {
  console.log(msg);
});

//8. to send the msg payload to the server

let messages = [];

chat.on('message', message => {  //11. print the msg payload!!!!
  console.clear();
  messages.push(message);
  messages.forEach(message => {
    console.log(message);
       
  }); 
});


async function getMsg() {
  console.clear();
  const input = await inquirer.prompt([
    { name: 'username'},
  ]);
  let name = input.username;
  chat.emit('message', `Name: ${name}`);
  getMsg();
}
getMsg();


