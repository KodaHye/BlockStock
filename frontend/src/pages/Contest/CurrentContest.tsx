import React from "react";
import styled from "styled-components";
import CurrentContestContent from "../../components/Contest/ContestStore/CurrentContest/CurrentContestContent";
import ContestStoreBtn from "../../components/Contest/ContestStore/ContestStoreBtn";
function CurrentContest(){

  const Container = styled.div`
    margin: 30px 0px 0px 200px;
    width: 1200px;
    height: 800px;
  `;

  return(
    <Container>
      <ContestStoreBtn/>
      <CurrentContestContent/>
    </Container>
  )
}

export default CurrentContest