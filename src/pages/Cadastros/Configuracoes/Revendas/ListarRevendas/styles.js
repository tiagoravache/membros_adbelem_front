import styled from "styled-components";

export const Container = styled.div`
  max-width: 95%;
  margin: 0 auto;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px;
  hr {
    margin: 30px 0px;
    border: none;
    border-bottom: 1px solid #ddd;
    width: 100%;
  }
`;

export const BodyHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-size: 14px;
    height: 46px;
    min-width: 225px;
    color: #fff;
    background: #3735f9;
    text-transform: uppercase;
    border: 0;
    border-radius: 5px;
    margin-left: 20px;
    .plus {
      font-size: 14px;
      margin-right: 5px;
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  input {
    max-width: 400px;
    flex: 1;
    height: 46px;
    line-height: 46px;
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
    font-size: 18px;
    background: #3735f9;
    height: 46px;
    border: 0;
    border-radius: 5px;
    width: 50px;
    margin-left: 5px;
    cursor: pointer;
  }
`;

export const Table = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  border-radius: 0.3em;
  overflow: hidden;
  width: 100%;
  thead {
    background: #d0d0d0;
    text-transform: uppercase;
    color: #565656;
    tr {
      height: 60px;
      th {
        padding: 15px;
        text-align: left;
      }
    }
  }
  tbody {
    background: #fff;
    color: #565656;
    tr {
      border-bottom: 1px solid #ddd;
      &:hover {
        background-color: #e7ffd2;
      }
      td {
        padding: 15px;
        a {
          flex: 0;
          margin: 3px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 12px;
          height: 26px;
          width: 100%;
          color: #fff;
          background: #3735f9;
          text-transform: uppercase;
          border: 0;
          border-radius: 5px;
          .edit {
            font-size: 12px;
            margin-right: 5px;
          }
        }
        button {
          flex: 0;
          margin: 3px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 12px;
          height: 26px;
          width: 100%;
          color: #fff;
          background: #e74c3c;
          text-transform: uppercase;
          border: 0;
          border-radius: 5px;
          cursor: pointer;
          .del {
            font-size: 14px;
            margin-right: 5px;
          }
        }
        &:last-child > div {
          @media only screen and (min-width: 1140px) {
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
        }
      }
    }
  }
`;
