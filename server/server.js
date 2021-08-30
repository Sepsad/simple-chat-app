const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const formatMessage = require("./utils/message");

const { 
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers} = require("./utils/users")


let app = express();
let server = http.createServer(app);
let io = socketIO(server);

// static folder
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath))

// run when user connects
io.on('connection', (socket) => {

    console.log("NEW USER IS Conncted!")

    socket.on( "joinRoom", ({username, room}) => {
        console.log(`Joined! ${username} to ${room}`)

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit("message", formatMessage("Admin", `WELCOME! ${username}`));

        socket.broadcast.to(user.room).emit('message',
                                            formatMessage('Admin', `${username} has joined!`));
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    
    socket.on("disconnect", () => {
        console.log("user is disconnected from server.")

        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage('Admin',`${user.username} has left!`));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});


const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
