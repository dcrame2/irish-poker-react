import React, { useState } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import UsersCard from "../components/UsersCard";
import GameScreen from "../pages/GameScreen";

const GameContainer = styled.div`
  max-width: 1000px;
  margin: auto;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: grey;
  .inner-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const StartGameScreen = ({ users, playerOne, outputRoomName }) => {
  const [gameStarted, setGameStarted] = useState(false);

  console.log(users);
  const startGameHandler = () => {
    setGameStarted(true);
  };
  return (
    <GameContainer>
      {!gameStarted ? (
        <div className="inner-container">
          <h1>Waiting for more players...</h1>
          {/* {outputRoomName(users[0].room)} */}
          <h2>Players:</h2>
          {users.map((user, i) => {
            return (
              <UsersCard
                playerNumber={i + 1}
                users={user.username}
                key={user.id}
              />
            );
          })}

          {users[0] ? (
            <button onClick={startGameHandler}>Start Game</button>
          ) : (
            `player 1 starts the game`
          )}
        </div>
      ) : (
        <GameScreen />
      )}
    </GameContainer>
  );
};

export default StartGameScreen;
