const chatForm = document.getElementById('chat-form');
const chatMessage = document.getElementById()



let socket = io();

socket.on("connect", function () {
    console.log("you are Connected!")
})

socket.on("disconnect", function () {
    console.log("you are disConnected!")
} )