// import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import styled from "styled-components";
const socket = io.connect("http://localhost:3002");

const GameContainer = styled.div`
  max-width: 1000px;
  margin: auto;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: green;
  .inner-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

function App() {
  //Room State
  const [room, setRoom] = useState("");
  const [roomJoined, setRoomJoined] = useState(false);
  const [name, setName] = useState("");
  const [nameReceived, setNameReceived] = useState("");
  const users = [];

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
    setRoomJoined(true);
  };

  const sendName = () => {
    socket.emit("send_name", { name, room });
    users.push(name);
    console.log(users);
  };

  useEffect(() => {
    socket.on("receive_name", (data) => {
      setNameReceived(data.name);
    });
  }, [socket]);
  return (
    <GameContainer>
      <div className="inner-container">
        <input
          placeholder="Room Number..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button onClick={joinRoom}>Join Room</button>
        {roomJoined && (
          <>
            <input
              placeholder="Name..."
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            <button onClick={sendName}>Confirm</button>
          </>
        )}
        <h1>Name:</h1>
        {nameReceived}
      </div>
    </GameContainer>
  );
}

export default App;
