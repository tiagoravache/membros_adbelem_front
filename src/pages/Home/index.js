import React, { Component } from "react";

import { Container, Body } from "./styles";

export default class Home extends Component {
  render() {
    return (
      <Container>
        <Body>
          <h1>Bem vindo!</h1>
          <hr />
          <p>Acesse seu login para visualizar o histórico de ofertas e comunicados da secretária.</p>
        </Body>
      </Container>
    );
  }
}
