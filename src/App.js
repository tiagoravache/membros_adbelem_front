import React, { Fragment, Component } from "react";
import Routes from "./routes";
import GlobalStyle from "./styles/global";

class App extends Component {
  render() {
    return (
      <Fragment>
        <GlobalStyle />
        <Routes />
      </Fragment>
    );
  }
}

export default App;
