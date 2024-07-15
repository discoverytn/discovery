const express = require('express')
const http = require('http')
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://192.168.1.15:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

let chatRooms = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('join-room', ({ eventName, idexplorer, idbusiness }) => {
    const roomName = `${eventName}-${idexplorer}-${idbusiness}`;
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);
  });

  socket.on('send-message', ({ message, idexplorer, idbusiness, eventName }) => {
    const roomName = `${eventName}-${idexplorer}-${idbusiness}`;
    io.to(roomName).emit('receive-message', { message });
    console.log(`Message sent in room ${roomName}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    chatRooms = chatRooms.filter(room => room.id !== socket.id);
    io.emit("get-users", chatRooms);
  });
});

app.get("/api", (req, res) => {
  res.json({ data: "API is working" });
});

server.listen(3001, () => {
  console.log('Server of chat  started - http://192.168.1.15:3000');
});

module.exports = { io }
