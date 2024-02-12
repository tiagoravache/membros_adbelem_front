import styled from "styled-components";

export const DivTabs = styled.div`
  width: 100%;
`;

export const TabList = styled.ul`
  display: flex;
  .tab-list-active {
    position: relative;
    background-color: #696969;
    &:after {
      content: " ";
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      border-top: 15px solid #696969;
      position: absolute;
      width: 0;
      height: 0;
      bottom: -15px;
      left: 40%;
    }
  }
`;

export const TabContent = styled.div`
  display: flex;
  background-color: #fff;
  margin-top: 15px;
  padding: 20px;
  border: 1px solid #ddd;
`;
