// const io = require('socket.io-client');
// const chat = io.connect('http://localhost:3030/chat');
// 'http://localhost'
// in index ejs <%# <a href="/< room>">chat</a> %> 
console.log('hiiiiiiiiiiiiiiiiiii');
const socket = io();
// let messageForm = document.getElementById('chat-form');
// const room = 'Private Chat Room';
// console.log(client.request.headers.cookie);

// socket.emit('joinRoom', room);  //3. send the room name to the server
socket.on('joinRoom', room => {
  console.log(room);
});  //7. print the room name 
socket.on('disconnected', (msg) => {
  console.log(msg);
  outputmessage(msg);

});
//8. to send the msg payload to the server
// let messages = [];
const chatform = document.getElementById('chat-form');
socket.on('message', (message) =>{
  console.log('message1',message);
  outputmessage(message);
});
if (chatform != null) {
  // const name = prompt('What is your name?');
  outputmessage('You joined');
  socket.emit('new-user', roomName, name);

  chatform.addEventListener('submit', e => {
    e.preventDefault();
    const message = e.target.elements.msg.value;
    outputmessage(`You: ${message}`);
    socket.emit('message', roomName, message);
    e.target.elements.msg.value = '';
  });
}
socket.on('message', data => {
  outputmessage(`${data.name}: ${data.message}`);
});
socket.on('user-connected', name => {
  outputmessage(`${name} connected`);
});

socket.on('user-disconnected', name => {
  outputmessage(`${name} disconnected`);
});

// chatform.addEventListener('submit', (e)=> {
//   e.preventDefault();
//   const msg = e.target.elements.msg.value;
//   console.log(msg);
//   socket.emit('message', msg);
// });
let date = new Date(Date.now());
function outputmessage(message)
{
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML=`<p class="meta">${message}<span>${date}</span></p>
  <p class="text">
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// socket.on('message', message => {  //11. print the msg payload!!!!
//   console.clear();
//   messages.push(message);
//   messages.forEach(message => {
//     console.log(message);
       
//   }); 
// });


// async function getMsg() {
//   console.clear();
//   const input = await inquirer.prompt([
//     { name: 'username'},
//   ]);
//   let name = input.username;
//   socket.emit('message', `Name: ${name}`);
//   getMsg();
// }
// getMsg();

////////////////////////////////
// const socket=io();
// const chatform=document.getElementById('chat-form');
// socket.on('message',(message)=>{
//   outputmessage(message);
// });

// chatform.addEventListener('submit',(e)=>{
//   e.preventDefault();
//   const msg=e.target.elements.msg.value;
//   socket.emit('chatmessage',msg);
// });

// function outputmessage(message)
// {
//   const div=document.createElement('div');
//   div.classList.add('message');
//   div.innerHTML=`<p class="meta">alaa<span>9:15pm</span></p>
//   <p class="text">
// ${message}
//   </p>`;
//   document.querySelector('.chat-messages').appendChild(div);
// }