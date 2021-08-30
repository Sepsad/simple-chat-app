const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

let socket = io();

socket.on("connect", function () {
    console.log("you are Connected!")
})

socket.on("disconnect", function () {
    console.log("you are disConnected!")
} )

socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({room, users}) => {
    showRoomName(room);
    showUsers(users);
});

// Message from server
socket.on('messaage', (message) => {
    console.log(message);
    showMessage(message);

    chatMessage.scrollTop = chatMessage.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    console.log(e);

    let msg = e.target.elements.msg.value;

    console.log(msg);

    msg = msg.trim();

    if(!msg) {

        return false
    }

    socket.emit('message', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});






// show message to DOM
function showMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');

    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;

    div.appendChild(p);

    const p_message = document.createElement('p');
    p_message.classList.add('text');
    p_message.innerText = message.text;

    div.appendChild(p_message)

    document.querySelector('.chat-messages').appendChild(div);
};

// show room name

function showRoomName(room) {

    roomName.innerHTML = room;
}

//show users

function showUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

