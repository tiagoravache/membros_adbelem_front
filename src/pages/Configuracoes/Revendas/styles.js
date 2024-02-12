import styled from "styled-components";

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
`;

export const ListHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #696969;
  text-transform: uppercase;
  width: 100%;
  h1 {
    text-align: center;
    font-size: 24px;
  }
  h3 {
    margin-top: 15px;
    text-align: center;
    font-size: 18px;
    font-weight: normal;
    margin-bottom: 10px;
  }
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .selected {
    background: #55c2ff;
  }
  li {
    width: 100%;
    list-style-type: none;
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    color: #565656;
    padding: 15px;
    background: #fff;
    margin-top: 10px;
    border: 1px solid #ddd;
    cursor: pointer;
    &:hover {
      background: #55c2ff;
    }
  }
`;
