'use strict';
const socket=io();
const chatform=document.getElementById('chat-form');
socket.on('message',(message)=>{
  outputmessage(message);
});

chatform.addEventListener('submit',(e)=>{
  e.preventDefault();
  const msg=e.target.elements.msg.value;
  socket.emit('chatmessage',msg);
});

function outputmessage(message)
{
  const div=document.createElement('div');
  div.classList.add('message');
  div.innerHTML=`<p class="meta">alaa<span>9:15pm</span></p>
  <p class="text">
${message}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}