const express = require("express");
const app = express();
const http = require("http");
// const path = require("path");
const { Server } = require("socket.io");
const server = http.createServer(app);
const cors = require("cors");

app.use(cors);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

// const formatMessage = require("./utils/messages");
// const {
//   userJoin,
//   getCurrentUser,
//   userLeave,
//   getRoomUsers,
// } = require("./utils/users");

// Set static folder
// app.use(express.static(path.join(__dirname, "client", "public", "index.html")));

// Run when client connects
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_name", (data) => {
    socket.to(data.room).emit("receive_name", data);
  });

  //   socket.on("joinRoom", ({ username, room }) => {
  //     const user = userJoin(socket.id, username, room);

  //     socket.join(user.room);

  //     // Welcome current user
  //     // socket.emit("message", formatMessage(botName, "Welcome to CharCord!"));

  //     // Broadcast when a user connects
  //     //broadcast.emit() shows a messages to everyone but the current client.
  //     // socket.broadcast
  //     //   .to(user.room)
  //     //   .emit(
  //     //     "message",
  //     //     formatMessage(botName, `${user.username} has joined the chat`)
  //     // );

  //     // Send users and room info
  //     io.to(user.room).emit("roomUsers", {
  //       room: user.room,
  //       users: getRoomUsers(user.room),
  //     });
  //   });

  //all clients in general
  //   io.emit()

  //Listen for chat message
  // socket.on("chatMessage", (msg) => {
  //   const user = getCurrentUser(socket.id);
  //   io.to(user.room).emit("message", formatMessage(user.username, msg));
  // });

  // Runs when client disconnects
  //   socket.on("disconnect", () => {
  //     const user = userLeave(socket.id);

  //     if (user) {
  //       // io.to(user.room).emit(
  //       //   "message",
  //       //   formatMessage(botName, `${user.username} has left the chat`)
  //       // );

  //       // Send users and room info
  //       io.to(user.room).emit("roomUsers", {
  //         room: user.room,
  //         users: getRoomUsers(user.room),
  //       });
  //     }
  //   });
});

const PORT = 3002 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
