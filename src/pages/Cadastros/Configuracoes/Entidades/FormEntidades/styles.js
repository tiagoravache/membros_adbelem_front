import styled from "styled-components";

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  hr {
    margin: 20px 0px;
    border: none;
    border-bottom: 1px solid #ddd;
    width: 100%;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  h1 {
    font-size: 38px;
    font-weight: normal;
    color: #565656;
    letter-spacing: 2px;
  }
  button {
    padding: 10px 20px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  .plus {
    margin-right: 5px;
  }
  .delete {
    background-color: #dc3545;
  }
  label {
    color: #565656;
    letter-spacing: 2px;
  }
  input {
    flex: 1;
    height: 46px;
    line-height: 46px;
    margin-top: 10px;
    margin-bottom: 15px;
    padding: 0 20px;
    color: #777;
    font-size: 15px;
    width: 100%;
    border: 1px solid #ddd;
  }
  select {
    flex: 1;
    height: 46px;
    color: #777;
    font-size: 15px;
    padding: 0 20px;
    width: 100%;
    border: 1px solid #ddd;
    cursor: pointer;
    margin-top: 10px;
    margin-bottom: 15px;
  }
  button {
    color: #fff;
    font-size: 14px;
    background: #669940;
    border: 0;
    border-radius: 5px;
    font-weight: bold;
    letter-spacing: 2px;
    cursor: pointer;
    padding: 10px 15px;
    text-transform: uppercase;
    font-weight: 300;
  }
  img {
    margin-top: 25px;
    max-width: 225px;
    height: auto;
  }
`;

export const GroupColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-basis: 100%;
  flex: 1;
  width: 100%;
`;

export const GroupRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
`;

export const InputGroup = styled.div`
  padding: 5px 0px;
`;

export const UploadGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  width: 250px;
  span {
    color: #fff;
    font-size: 14px;
    background: #3575f9;
    border: 0;
    border-radius: 5px;
    font-weight: 300;
    letter-spacing: 2px;
    cursor: pointer;
    padding: 15px 20px;
    text-transform: uppercase;
  }
  .faImage {
    margin-top: 25px;
    font-size: 185px;
    color: #bfbfbf;
  }
  input {
    display: none;
  }
`;

export const Table = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  border-radius: 0.3em;
  overflow: hidden;
  max-width: 100%;
  thead {
    background: #d0d0d0;
    text-transform: uppercase;
    color: #565656;
    tr {
      height: 60px;
      .actions {
        width: 10%;
      }
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
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 12px;
          height: 26px;
          min-width: 90px;
          color: #fff;
          background: #3575f9;
          text-transform: uppercase;
          border: 0;
          border-radius: 5px;
          .edit {
            font-size: 12px;
            margin-right: 5px;
          }
        }
      }
    }
  }
`;

export const CheckBoxGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  input {
    &:checked,
    &:not(:checked) {
      position: absolute;
      left: -9999px;
    }
    &:checked + label,
    &:not(:checked) + label {
      position: relative;
      padding-left: 28px;
      cursor: pointer;
      line-height: 20px;
      display: inline-block;
      color: #666;
    }
    &:checked + label:before,
    &:not(:checked) + label:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 18px;
      height: 18px;
      border: 1px solid #ddd;
      background: #fff;
    }
    &:checked + label:after,
    &:not(:checked) + label:after {
      content: "";
      width: 12px;
      height: 12px;
      background: #a4cb82;
      position: absolute;
      top: 4px;
      left: 4px;
      -webkit-transition: all 0.2s ease;
      transition: all 0.2s ease;
    }
    &:not(:checked) + label:after {
      opacity: 0;
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    &:checked + label:after {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
`;
