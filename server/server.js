const express = require("express");
const app = express();
const http = require("http");
// const path = require("path");
const { Server } = require("socket.io");
const server = http.createServer(app);
const cors = require("cors");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("../utils/users");

app.use(cors);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Run when client connects
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    const user = userJoin(socket.id, data.name, data.room);

    console.log(`User joined ${data.room}: ${socket.id}`);
    console.log(user);
    socket.join(user.room);

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("send_name", (data) => {
    socket.to(data.room).emit("receive_name", data);
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
});

const PORT = 3002 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
