import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: white;
  position: relative;
`;

const Triangle = styled.div`
  width: 0;
  height: 0;
  border-left: 50vw solid transparent;
  border-right: 50vw solid transparent;
  border-bottom: 100vh solid black;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url("https://source.unsplash.com/random/1920x1080");
  background-size: cover;
  background-position: center;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
`;

const Content = styled.div`
  position: absolute;
  text-align: center;
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
`;

const Button = styled.button<{ bgColor: string }>`
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  background-color: ${(props) => props.bgColor};
  color: white;
  transition: 0.3s;
  &:hover {
    opacity: 0.8;
  }
`;

const Header = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: black;
  font-size: 1.5rem;
  font-weight: bold;
`;

const MenuIcon = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2rem;
  cursor: pointer;
  color: black;
`;

const HomeView: React.FC = () => {
  return (
    <Container>
      <Header>HOODWINK</Header>
      <MenuIcon>&#9776;</MenuIcon>
      <Triangle />
      <Content>
        <Title>LET'S LIE</Title>
        <Subtitle>It's Time to Lie</Subtitle>
        <div>
          <Button bgColor="#4CAF50">NEW ROOM</Button>
          <Button bgColor="#FF5722">JOIN ROOM</Button>
          <Button bgColor="#FFC107">LEARN</Button>
        </div>
      </Content>
    </Container>
  );
};

export default HomeView;
