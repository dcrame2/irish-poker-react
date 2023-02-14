import React from 'react';
import styled from 'styled-components';


const GameContainer = styled.div`
  max-width: 500px;
  margin: auto;
  height: 300px;
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

const GameStartedModal = () => {
    // console.log(data);
  return (
    <GameContainer>GameStartedModal</GameContainer>
  )
}

export default GameStartedModal