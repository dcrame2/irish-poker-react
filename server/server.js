const express = require("express");
const app = express();
const http = require("http");
// const path = require("path");
const { Server } = require("socket.io");
const server = http.createServer(app);
const cors = require("cors");
const axios = require("axios");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("../utils/users");

app.use(cors);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

// let playersCard = [];

// const players = (player) => {
//   console.log(player);
//   return playersCard.push(player);
// };

function getPlayersCards(array, cardAmount) {
  const playerCards = [];
  for (let i = 0; i < array.length; i += cardAmount) {
    playerCards.push(array.slice(i, i + cardAmount));
  }
  return playerCards;
}

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
    // Emit an event to all connected clients when the game starts
    socket.emit("gameStarted", "The game has started!");

    // calling deck of cards api
  });

  socket.on("send_name", (data) => {
    socket.to(data.room).emit("receive_name", data);
  });

  // Emit an event to all connected clients when the game starts
  socket.emit("gameStarted", "The game has started!");

  // Listen for the 'data' event on the socket instance
  socket.on("data", (data) => {
    let newArr = [];
    const singlePlayer = (deckId, users) => {
      // console.log(deckId);
      axios
        .get(
          `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${
            users.length * 4
          }`
        )
        // .then((res) => res.json()) // parse response as JSON
        .then((data) => {
          const players = getPlayersCards(data.data.cards, 4);
          console.log(players);
          players.map((player, i) => {
            if (i === 0) {
              player.player1 = users[0].id;
            }
            if (i === 1) {
              player.player2 = users[1].id;
            }
            newArr.push(...player);
          });
          // return playersCards;
          socket.emit("result", newArr);
        })
        .catch((err) => {
          console.log(`error ${err}`);
        });
    };
    // Process the data and send a response back to the client
    // singlePlayer(data.data.deck_id, data.users);
    singlePlayer(data.data.deck_id, data.users);
    // console.log("players Card: " + playersCard);

    // console.log(data.data.deck_id);
  });
});

const PORT = 3002 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
