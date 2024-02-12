import React, { Component } from "react";

import { Container, Body, ListHeader, List } from "./styles";
import { getUser, atualizarEntidade } from "../../../services/auth";

import Loading from "../../../components/Loading";
import api from "../../../services/api";
import endpoints from "../../../services/endpoints";

export default class Entidades extends Component {
  state = {
    loading: false,
    error: "",
    entidades: [],
    entidade: {
      id: null,
      nome: "",
    },
  };

  componentDidMount() {
    const {
      preferencias: { entidade },
    } = getUser();
    this.setState({ entidade });
    this.hideHeader();
    this.getEntidades();
  }

  async hideHeader() {
    return await this.props.value.onToggleHide(true);
  }

  getEntidades = async () => {
    this.setState({ loading: true });
    try {
      const response = await api.get(endpoints.configuracoes.entidades.listar, {
        params: {
          apenasAtivos: true,
        },
      });
      this.setState({
        loading: false,
        error: "",
        entidades: response.data.entidades,
      });
    } catch (err) {
      this.setState({
        loading: false,
        error:
          "Houve um problema ao listar as entidades, por gentileza tente novamente mais tarde.",
      });
    }
  };

  async showHeader() {
    return await this.props.value.onToggleHide(false);
  }

  sendEntidade = async (entidade) => {
    try {
      await api.post(endpoints.configuracoes.entidades.enviar, {
        entidade_id: entidade.id,
      });
      atualizarEntidade(entidade);
      this.setState({
        entidade,
        error: "",
      });
      this.showHeader();
      this.props.history.push("/app/cadastros/configs/revendas/1");
    } catch (err) {
      this.setState({
        error:
          "Houve um problema ao selecionar a entidade, por gentileza tente novamente mais tarde.",
      });
    }
  };

  render() {
    const {
      loading,
      entidades,
      entidade: { id: entidade_id, nome },
    } = this.state;
    return (
      <Container>
        <Body>
          <ListHeader>
            <h1>Selecione a sua entidade</h1>
            <h3>{nome}</h3>
          </ListHeader>
          <Loading loading={loading} message="" />
          <List>
            {entidades.map((entidade) => (
              <li
                key={entidade.id}
                className={entidade_id === entidade.id ? "selected" : ""}
                onClick={() => {
                  this.sendEntidade(entidade);
                }}
              >
                {entidade.nome}
              </li>
            ))}
          </List>
        </Body>
      </Container>
    );
  }
}
