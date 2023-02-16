import React from "react";
import styled from "styled-components";

const UsersCardContainer = styled.div`
  background-color: lightblue;
  padding: 10px;
`;

const UsersCard = ({ users, playerNumber }) => {
//   console.log(playerNumber);
  return (
    <UsersCardContainer>
      Player #{playerNumber}: {users}
    </UsersCardContainer>
  );
};

export default UsersCard;
