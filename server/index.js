const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Match your frontend URL
    methods: ["GET", "POST"], 
  },
});

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`); // Log on connection

  socket.on("join_room", (data) => {
    socket.join(data); // Join the user to the specified room
  });

  // Listen for the 'send_message' event
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data); // Broadcast the message to all other connected users (excluding the sender)
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
