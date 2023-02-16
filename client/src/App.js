// import "./App.css";
import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components/macro";
import StartGameScreen from "./pages/StartGameScreen";
import { Link } from "react-router-dom";
import UsersCard from "./components/UsersCard";
import GameStartedModal from "./components/GameStartedModal";
import GameScreen from "./pages/GameScreen";
import "./global.css";

const socket = io.connect("http://localhost:3002");

const GameContainer = styled.div`
  max-width: 1000px;
  margin: auto;
  height: 700px;
  display: flex;
  /* align-items: flex-start; */
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: grey;
  /* background-image: url("bp.jpg"); */
  background-position: center;
  background-size: cover;
  .inner-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-left: 100px;
    .form-container {
      display: flex;
      flex-direction: row;
      gap: 20px;
      justify-content: space-between;

      label {
        font-size: 24px;
        color: white;
      }
      input {
        background: transparent;
        border: 1px solid white;
        border-radius: 6px;
        padding: 10px;
        color: white;
        &::placeholder {
          color: white;
        }
      }
    }
    button {
      border: 1px solid white;
      background-color: green;
      border-radius: 6px;
      padding: 10px;
      color: white;
      transition: background-color 0.7s ease-in-out;
      /* transition: color 0.7s ease; */
      &:hover {
        transition: background-color 0.7s ease-in-out;
        /* transition: color 0.7s ease; */
        color: green;
        background-color: white;
        border: 1px solid green;
      }
    }
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

  // Game logic
  const [buttons, setButtons] = useState("color"); // color, hol, ioo, suit
  const [firstCard, showFirstCard] = useState(false);

  // do a true/ false state and if the button can be clickable

  const colorButtonHandler = () => {
    setButtons("color");
  };
  const holButtonHandler = () => {
    setButtons("hol");
    showFirstCard(true);
    socket.emit(
      "playersCard",
      gameData.filter((data, i) => i === 0)
    );
    // logic for playing the game
    // flipping card
    // emitting image & card value to the rest of the room.
  };
  const iooButtonHandler = () => {
    setButtons("ioo");
  };
  const suitButtonHandler = () => {
    setButtons("suit");
  };
  // red and black logic
  const redHandler = () => {};
  const blackHandler = () => {};
  // higher and lower logic
  const higherHandler = () => {};
  const lowerHandler = () => {};
  // in and out logic
  const inHandler = () => {};
  const outHandler = () => {};
  // suits logic
  const spadesHandler = () => {};
  const diamondsHandler = () => {};
  const heartsHandler = () => {};
  const clubsHandler = () => {};

  //  end of game logic

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
          <form>
            <div className="form-container">
              <label htmlFor="room">Room Name</label>
              <input
                name="room"
                id="room"
                type="text"
                placeholder="Room Name..."
                onChange={(event) => {
                  setRoom(event.target.value);
                }}
                required
              />
            </div>
            <div className="form-container">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username..."
                onChange={(event) => {
                  setName(event.target.value);
                }}
                required
              />
            </div>
            <button type="submit" onClick={joinRoom}>
              Join Game
            </button>
          </form>
        </div>
      ) : (
        <StartGameScreen
          buttons={buttons}
          firstCard={firstCard}
          colorButtonHandler={colorButtonHandler}
          holButtonHandler={holButtonHandler}
          iooButtonHandler={iooButtonHandler}
          suitButtonHandler={suitButtonHandler}
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
