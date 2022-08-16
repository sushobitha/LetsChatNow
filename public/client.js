
const socket = io();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('msgInput');
const messageContainer = document.getElementById("chat-container");

var audio = new Audio('ding.mp3');
audio.volume = 0.50;

const formatTime  = () =>{
    return (new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

const displayMessage = (user,message, position, time) =>{

    const messageChat = document.createElement("div");
    
    if(position == 'left'){
        messageChat.classList.add('chat-left');
    } else{
        messageChat.classList.add('chat-right');
    }
    messageChat.classList.add('chat');
    messageChat.classList.add(position);


    const messageMessageSection = document.createElement("div");
    messageMessageSection.classList.add('user');
    messageMessageSection.classList.add(position);
    messageMessageSection.innerText = `${user}`;

    const  messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');

    const messageTime = document.createElement('div');
    messageTime.innerText = time;
    messageTime.classList.add('time');


    messageChat.append(messageMessageSection);
    messageChat.append(messageElement);
    messageChat.append(messageTime);


    messageContainer.append(messageChat);

    messageContainer.scrollTop = messageContainer.scrollHeight;
    if(position == 'left'){
        audio.play();
    }
}

const closeForm = () =>{
    messageInput.value = '';
}

const joinedTheChat = (message) =>{
    const  messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('notify');
    messageElement.classList.add('joined');
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const welcomeChat = (message) =>{
    const  messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('welcome');
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const leftTheChat = (message) =>{
    const  messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('notify');
    messageElement.classList.add('leftChat');
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;

}

form.addEventListener('submit', e =>{
    e.preventDefault();
    const message = messageInput.value;
    displayMessage('You',message,'right',formatTime());
    socket.emit('send', message);
    messageInput.value = '';
})

let username;

while(!username){
    username =  prompt("Enter your name to join");
}
username = username? username : 'anonymous'

let room;
while(!room){
    room = prompt("Enter your room code");
}
room = room ? room : Math.random();

socket.emit('joinRoom',{username, room});

socket.on('user-joined', data =>{
    joinedTheChat(`${data} has joined the chat`);
});

socket.on('joinedChat', message =>{
    welcomeChat(message);
})

socket.on('receive', data =>{
    displayMessage(data.name.split(' ')[0] ,data.message, 'left', formatTime());
});

socket.on('left', data =>{
    leftTheChat(`${data.name? data.name : 'someone'} left the chat`);
});