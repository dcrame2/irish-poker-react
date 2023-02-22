import React, {useState} from 'react';
import styled from 'styled-components/macro';

const GameScreenContainer = styled.div`
  .game-inner-container {
    display: flex;
    flex-direction: column;
    gap: 3px;
    h3 {
      text-align: center;
    }
     .players-container {
      margin: 10px 5px;
       border: solid 1px white;
      .cards-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
          gap: 15px;
        .card-btn-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 15px;
            img {
              max-width: 35px;
            }
          }
      }
    }
    .container-of-btns {
         display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 20px;
            .btn-container {
                display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
    }
  }
`;

const GameScreen = ({message, gameData,currentPlayer, isLoading, users, redHandler, higherHandler, iooButtonHandler, suitButtonHandler, button, firstCard}) => {
  const player1 = gameData[0];
  const player2 = gameData[1];
  const player3 = gameData[2];
  const player4 = gameData[3];
  const player5 = gameData[4];
  const player6 = gameData[5];
  console.log(player2);
  return (
    <GameScreenContainer>
      <h1>Lets Start!</h1>
      <div className='game-inner-container'>
      {isLoading && <p>Loading data...</p>}
      {!isLoading && gameData.map((data, i) => {
        console.log(data);
          return (
          <div className='players-container'>
              <h3>{users[i].username}</h3>
              <div className='cards-container'>
                {data.map((d, i) => {
                  console.log(currentPlayer);
                  return (
                    <div className='card-btn-container'>
                  {/* <img src={d.image} alt="" /> */}
                  {firstCard && currentPlayer === i + 1 ? <img src={d.image} alt="" /> : <img src="/green_card.png" alt="" />}
                    </div>
                  )
                  })
                }
                </div>
                <div className="container-of-btns">
                      <div className='btn-container'>
                        <button onClick={redHandler}>Red</button>
                        <button onClick={redHandler}>Black</button>
                      </div> 
                      <div className='btn-container'>
                        <button >Lower</button>
                        <button onClick={higherHandler}>Higher</button>
                      </div> 
                      <div className='btn-container'>
                        <button>In</button>
                        <button>Out</button>
                      </div> 
                      <div className='btn-container'>
                        <button>Club</button>
                        <button>Spade</button>
                        <button>Diamond</button>
                        <button>Heart</button>
                      </div>            
              </div>            
          </div>
          )
      })}
  </div>
</GameScreenContainer>
  )
}

export default GameScreen