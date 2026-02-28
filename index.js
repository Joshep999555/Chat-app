const { disconnect } = require('cluster');
const console = require('console');
const express = require('express');
const http = require('http');
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
   res.sendFile(__dirname + "/index.html");
});

//io.on("connection", (socket) => { 
//    console.log("User connected");

//    socket.on("chat message", (msg) => {
//        io.emit("chat message", msg);
//    });

//    socket.on("disconnect", () => { 
//        console.log("User disconnected");
//    });
//}); 
io.on("connection", (socket) => { 
    
  
    socket.on('newuser', (name) => {
        let newUser = name;
        console.log(`${newUser} connected`);

        socket.on('disconnect', () => {
            console.log(`${newUser} disconnected`);
            
            io.emit('chat message', { user: 'System', msg: `${newUser} left the chat` });
        });
    });

  
    socket.on('chat message', (msg) => { 
        io.emit('chat message', msg);
    }); 
    
}); 

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});