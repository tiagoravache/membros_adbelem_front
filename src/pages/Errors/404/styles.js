import styled from "styled-components";

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: justify;
`;

export const Title = styled.h1`
  text-transform: uppercase;
  font-size: 186px;
  font-weight: 200;
  background: linear-gradient(130deg, #3475c1, #002273);
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  padding: 20px;
`;

export const SubTitle = styled.h2`
  font-size: 33px;
  font-weight: 200;
  text-transform: uppercase;
  margin-top: 0px;
  letter-spacing: 3px;
  color: #565656;
`;

export const Paragraph = styled.p`
  font-size: 16px;
  font-weight: 200;
  color: #565656;
  padding: 20px;
`;

export const Link = styled.a`
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  line-height: 40px;
  width: 200px;
  font-size: 14px;
  color: #fff;
  border: 1px solid #3475c1;
  -webkit-transition: 0.2s all;
  transition: 0.2s all;
  font-weight: 200;
  text-decoration: none;
  cursor: pointer;
  background: #3475c1;
  text-transform: uppercase;
  &:hover {
    color: #fff;
    background-color: #002273;
    border-color: #002273;
  }
`;
