import React from "react";

import { Container, Title, SubTitle, Paragraph, Link } from "./styles";

const Error404 = () => (
  <Container>
    <Title>404</Title>
    <SubTitle>OOPS! Página não encontrada</SubTitle>
    <Paragraph>
      A página que você está procurando pode ter sido removida ou seu nome foi
      alterado ou está temporariamente indisponível.
    </Paragraph>
    <Link href="/">Voltar para Home</Link>
  </Container>
);

export default Error404;
