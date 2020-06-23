// const io = require('socket.io-client');
// const chat = io.connect('http://localhost:3030/chat');
// 'http://localhost'
// in index ejs <%# <a href="/< room>">chat</a> %> 
console.log('hiiiiiiiiiiiiiiiiiii');
const socket = io();
const room = 'Private Chat Room';
// console.log(client.request.headers.cookie);
socket.emit('joinRoom', room);  //3. send the room name to the server
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
chatform.addEventListener('submit', (e)=> {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  console.log(msg);
  socket.emit('message', msg);
});
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