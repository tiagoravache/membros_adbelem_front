import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
`;

export const Form = styled.form`
  .ball-scale-ripple > div {
    width: 35px;
    height: 35px;
  }
  border: 1px solid #ddd;
  width: 400px;
  background: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 200px;
    margin: 10px 0 20px;
  }
  h1 {
    font-size: 20px;
    font-weight: normal;
    color: #3475c1;
    margin-bottom: 30px;
  }
  input {
    flex: 1;
    height: 46px;
    line-height: 46px;
    margin-bottom: 15px;
    padding: 0 20px;
    color: #777;
    font-size: 15px;
    width: 100%;
    border: 1px solid #ddd;
    &::placeholder {
      color: #999;
    }
  }
  button {
    color: #fff;
    font-size: 16px;
    background: #3475c1;
    height: 56px;
    border: 0;
    border-radius: 5px;
    width: 100%;
    font-weight: bold;
    margin-top: 10px;
    cursor: pointer;
  }
  hr {
    margin: 20px 0;
    border: none;
    border-bottom: 1px solid #cdcdcd;
    width: 100%;
  }
  a {
    margin-top: 15px;
  }
`;
