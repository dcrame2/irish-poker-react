// import "./App.css";
import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components/macro";
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

function App() {
  //Room State
  const [room, setRoom] = useState("");
  const [roomJoined, setRoomJoined] = useState(false);
  const [name, setName] = useState("");
  const [nameReceived, setNameReceived] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [gameData, setGameData] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // START OF INITAL SCREEN - JOIN ROOM

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", { name, room });
    }
    socket.emit("send_name", { name, room });
    setRoomJoined(true);
  };

  // END OF INITAL SCREEN - JOIN ROOM

  // START OF GAME SCREEN

  const gameStartHandler = () => {
    socket.emit("start game", { users, room });
    // Handle the result data
  };

  const outputRoomName = (room) => {
    return <div>Your room is {room}</div>;
  };

  console.log(gameData);

  useEffect(() => {
    socket.on("receive_name", (data) => {
      setNameReceived(data.name);
    });

    socket.on("roomUsers", ({ room, users }) => {
      outputRoomName(room);
      setUsers(users);
    });
  }, [socket]);

  // END OF START GAME SCREEN

  // START OF GAME SCREEN

  useEffect(() => {
    socket.on("game screen", () => {
      setGameStarted(true);
    });

    socket.on("result", (result) => {
      setIsLoading(false);
      setGameData(result);
    });
  }, [socket]);

  // END OF GAME SCREEN

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
          gameData={gameData}
          gameStarted={gameStarted}
          message={message}
          gameStartHandler={gameStartHandler}
          outputRoomName={outputRoomName}
          users={users}
          isLoading={isLoading}
        />
      )}
    </GameContainer>
  );
}

export default App;
