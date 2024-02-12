import React from "react";
import { OverlayContent, Wrapper, Message } from "./styles";
import Spinner from "react-spinkit";

const Loading = ({ loading, message, color }) => {
  return loading ? (
    <OverlayContent>
      <Wrapper>
        <Spinner
          name="ball-scale-ripple"
          fadeIn="none"
          color={color ? color : "olive"}
        />
        <Message>{message}</Message>
      </Wrapper>
    </OverlayContent>
  ) : null;
};

export default Loading;
