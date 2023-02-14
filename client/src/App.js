// import "./App.css";
import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import StartGameScreen from "./pages/StartGameScreen";
import { Link } from "react-router-dom";
import UsersCard from "./components/UsersCard";
import GameStartedModal from "./components/GameStartedModal";
import GameScreen from "./pages/GameScreen";

const socket = io.connect("http://localhost:3002");

const GameContainer = styled.div`
  max-width: 1000px;
  margin: auto;
  height: 700px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: grey;
  .inner-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .user-list {
      background-color: lightblue;
      padding: 10px;
    }
  }
`;

// let screen = <StartGameScreen />;
function App() {
  //Room State
  const [room, setRoom] = useState("");
  const [roomJoined, setRoomJoined] = useState(false);
  const [name, setName] = useState("");
  const [nameReceived, setNameReceived] = useState("");
  const [users, setUsers] = useState([]);
  const playerOne = users[0];
  const [message, setMessage] = useState("");
  let deckId = "";
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", { name, room });
    }

    socket.emit("send_name", { name, room });
    setRoomJoined(true);

    socket.emit("startGame", users);
  };

  const apiCall = () => {
    const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`;
    fetch(url)
      .then((res) => res.json()) // parse response as JSON
      .then((data) => {
        console.log(data);
        socket.emit("data", { data, users });
      })
      .catch((err) => {
        console.log(`error ${err}`);
      });
  };

  const gameStartHandler = () => {
    socket.emit("gameStarted", { name, room });
    apiCall();
    socket.on("result", (result) => {
      // Handle the result data
      console.log("Received result:", result);
    });
  };

  useEffect(() => {
    socket.on("receive_name", (data) => {
      setNameReceived(data.name);
    });

    socket.on("roomUsers", ({ room, users }) => {
      outputRoomName(room);
      setUsers(users);
    });

    // Listen for the "gameStarted" event
    socket.on("gameStarted", (data) => {
      setMessage(data);
    });
  }, [socket]);

  const outputRoomName = (room) => {
    return <div>Your room is {room}</div>;
  };
  return (
    <GameContainer>
      {!roomJoined ? (
        <div className="inner-container">
          <label htmlFor="room">Room</label>
          <input
            name="room"
            id="room"
            type="text"
            placeholder="Room Number..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Name..."
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join Game</button>
        </div>
      ) : (
        <StartGameScreen
          message={message}
          gameStartHandler={gameStartHandler}
          outputRoomName={outputRoomName}
          playerOne={playerOne}
          users={users}
        />
      )}
    </GameContainer>
  );
}

export default App;
