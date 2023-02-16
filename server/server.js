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
let newArr = [];
app.use(cors);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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
  });

  socket.on("send_name", (data) => {
    socket.to(data.room).emit("receive_name", data);
  });

  socket.on("start game", (userData) => {
    const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`;
    axios
      .get(url)

      .then((data) => {
        const singlePlayer = (deckId, users) => {
          axios
            .get(
              `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${
                userData.users.length * 4
              }`
            )
            .then((data) => {
              const players = getPlayersCards(data.data.cards, 4);
              newArr = players.map((player, i) => {
                if (i === 0) {
                  player.player1 = userData.users[0].id;
                }
                if (i === 1) {
                  player.player2 = userData.users[1].id;
                }
                if (i === 2) {
                  player.player3 = userData.users[2].id;
                }
                if (i === 3) {
                  player.player4 = userData.users[3].id;
                }
                if (i === 4) {
                  player.player5 = userData.users[4].id;
                }
                if (i === 5) {
                  player.player6 = userData.users[5].id;
                }
                return player;
              });
              console.log(newArr);
              console.log(userData.room);
              io.to(userData.room).emit("result", newArr);
              return newArr;
            })
            .catch((err) => {
              console.log(`error ${err}`);
            });
        };

        // Process the data and send a response back to the client
        singlePlayer(data.data.deck_id, data.users);
      })
      .catch((err) => {
        console.log(`error ${err}`);
      });

    io.to(userData.room).emit("game screen");
  });

  socket.on("playersCard", (data) => {
    console.log("playersCard data:", data);
    io.emit("playerOneCards", data);
  });
});

const PORT = 3002 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
