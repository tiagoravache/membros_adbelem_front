import React, { Component } from "react";

import { Container, Body, ListHeader, List } from "./styles";
import { getUser, atualizarRevenda } from "../../../services/auth";

import Loading from "../../../components/Loading";
import api from "../../../services/api";
import endpoints from "../../../services/endpoints";

export default class Revendas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: "",
      revendas: [],
      revenda: {
        id: null,
        razao_social: "",
      },
    };
  }

  componentDidMount() {
    const {
      preferencias: { revenda },
    } = getUser();
    this.setState({ revenda });
    this.hideHeader();
    this.getRevendas();
  }

  async hideHeader() {
    return await this.props.value.onToggleHide(true);
  }

  getRevendas = async () => {
    this.setState({ loading: true });
    try {
      const response = await api.get(endpoints.configuracoes.revendas.listar, {
        params: {
          apenasAtivos: true,
        },
      });
      this.setState({
        loading: false,
        error: "",
        revendas: response.data.revendas,
      });
    } catch (err) {
      this.setState({
        loading: false,
        error:
          "Houve um problema ao listar as revendas, por gentileza tente novamente mais tarde.",
      });
    }
  };

  sendRevenda = async (revenda) => {
    try {
      await api.post(endpoints.configuracoes.revendas.enviar, {
        revenda_id: revenda.id,
      });
      atualizarRevenda(revenda);
      this.setState({
        revenda,
        error: "",
      });
      this.props.history.push("/app/configs/entidades");
    } catch (err) {
      this.setState({
        error:
          "Houve um problema ao selecionar a revenda, por gentileza tente novamente mais tarde.",
      });
    }
  };

  render() {
    const {
      loading,
      revendas,
      revenda: { id: revenda_id, razao_social },
    } = this.state;
    return (
      <Container>
        <Body>
          <ListHeader>
            <h1>Selecione a sua revenda</h1>
            <h3>{razao_social}</h3>
          </ListHeader>
          <Loading loading={loading} message="" />
          <List>
            {revendas.map((revenda) => (
              <li
                key={revenda.id}
                className={revenda_id === revenda.id ? "selected" : ""}
                onClick={() => {
                  this.sendRevenda(revenda);
                }}
              >
                {revenda.razao_social}
              </li>
            ))}
          </List>
        </Body>
      </Container>
    );
  }
}
