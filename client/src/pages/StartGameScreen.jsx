import React, { useState } from "react";
import styled from "styled-components/macro";
import io from "socket.io-client";
import UsersCard from "../components/UsersCard";
import GameScreen from "../pages/GameScreen";

const GameContainer = styled.div`
  .inner-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const StartGameScreen = ({ isLoading, users, gameData, outputRoomName, gameStartHandler, message, gameStarted }) => {
  console.log(gameStarted);
  return (
    <GameContainer>
      {!gameStarted ? (
        <div className="inner-container">
          <h1>Waiting...</h1>
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
      
            <button onClick={gameStartHandler}>Start Game</button>
         
        </div>
      ) : (
        <GameScreen gameData={gameData} message={message} isLoading={isLoading} users={users}/>
      )}
    </GameContainer>
  );
};

export default StartGameScreen;
