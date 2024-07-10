const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://192.168.26.72:3000", 
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

let chatRooms = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  // this is for joinin rooms and the other for creatin one 
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

  // socket.on("createRoom", (roomName) => {
  //   socket.join(roomName);
  //   chatRooms.unshift({ id: socket.id, roomName, messages: [] });
  //   socket.emit("roomsList", chatRooms);
  //   console.log("Chat rooms:", chatRooms);
  // });

  // socket.on("send-message", (data) => {
  //   console.log("Message data:", data);
  //   if (data !== undefined && chatRooms.length > 0) {
  //     chatRooms[0].messages.push(data);
  //     socket.broadcast.emit("send-message", chatRooms);
  //   }
  // });

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
  console.log('Server started - http://192.168.26.72:3000');
});