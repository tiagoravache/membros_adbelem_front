import styled from "styled-components";

export const OverlayContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  left: 0;
  top: 0;
  align-items: center;
  height: 100%;
  z-index: 99999;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
`;

export const Message = styled.div`
  color: #000;
  font-weight: bold;
  font-size: 30px;
`;
