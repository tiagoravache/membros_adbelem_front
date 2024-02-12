import styled from "styled-components";

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 20px;
  margin-top: 30px;
  h1 {
    font-size: 38px;
    font-weight: normal;
    color: #000000;
  }
  hr {
    margin: 30px 0px;
    border: none;
    border-bottom: 1px solid #ddd;
    width: 100%;
  }
  p {
    color: #000000;
    line-height: 1.5;
  }
`;
