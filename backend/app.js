require("dotenv").config();
const express = require("express");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./Routes/authRoutes");
const explorerRoutes = require("./routes/explorerRoutes"); // Corrected path
const businessRoutes = require("./routes/businessRoutes");
const postRoutes = require('./Routes/postRoutes');
const chatRoutes = require('./Routes/chatRoutes')
const db = require("./database/index");
const app = express();
const transporter = require("./resetCode"); 

app.use(express.json());
const http = require("http").Server(app)
const cors = require ('cors')
const socketIO = require('socket.io')(http, {
  cors: {
      origin: "<http://localhost:3000>"
  }
});

//👇🏻 Add this before the app.get() block
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('disconnect', () => {
    socket.disconnect()
    console.log('🔥: A user disconnected');
  });
});
//👇🏻 Generates random string as the ID
const generateID = () => Math.random().toString(36).substring(2, 10);

let chatRooms = [
    //👇🏻 Here is the data structure of each chatroom
    // {
    //  id: generateID(),
    //  name: "Novu Hangouts",
    //  messages: [
    //      {
    //          id: generateID(),
    //          text: "Hello guys, welcome!",
    //          time: "07:50",
    //          user: "Tomer",
    //      },
    //      {
    //          id: generateID(),
    //          text: "Hi Tomer, thank you! 😇",
    //          time: "08:50",
    //          user: "David",
    //      },
    //  ],
    // },
];

socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("createRoom", (roomName) => {
        socket.join(roomName);
        //👇🏻 Adds the new group name to the chat rooms array
        chatRooms.unshift({ id: generateID(), roomName, messages: [] });
        //👇🏻 Returns the updated chat rooms via another event
        socket.emit("roomsList", chatRooms);
    });

    socket.on("disconnect", () => {
        socket.disconnect();
        console.log("🔥: A user disconnected");
    });
});

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes); 
app.use("/explorer", explorerRoutes); // Using the correct route definition
app.use("/business", businessRoutes);
app.use('/posts', postRoutes);
app.use('/chat',chatRoutes)

app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log("Email sent successfully");
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 3000; // Ensure a default port if PORT is not defined

app.listen(PORT, () => {
  console.log(`Server listening at http://${process.env.DB_HOST}:${PORT}`);
});
