import React from 'react';
import styled from 'styled-components';

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

const GameScreen = ({message}) => {
    console.log(message);
  return (
    <GameContainer>{message}</GameContainer>
  )
}

export default GameScreen