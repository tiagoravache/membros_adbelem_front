import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Body, BodyHeader, Form, Table } from "./styles";
import Loading from "../../../../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faPlus,
  faEdit,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../../../../services/api";
import endpoints from "../../../../../services/endpoints";
import { hasRole, isAllowed } from "../../../../../services/auth";
import { permissions } from "../../../../../services/permissions";
import { NotifyComponent, NotifyError } from "../../../../../components/Notify";
import ReactPaginate from "react-paginate";
import Autosuggest from "react-autosuggest";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default class Revendas extends Component {
  state = {
    loading: false,
    revendas: {
      revendas: [],
      total: 0,
      limit: 0,
      page: 0,
      pages: 0,
    },
    value: "",
    suggestions: [],
  };

  showModal = (id) => {
    MySwal.fire({
      title: "Você tem certeza?",
      text: "Você não poderá reverter esta ação!",
      type: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#e74c3c",
      confirmButtonText: "Sim, deletar!",
      cancelButtonColor: "#7777",
      cancelButtonText: "Não, cancelar!",
    }).then(async (result) => {
      if (result.value) {
        try {
          await api.delete(
            `${endpoints.cadastros.configuracoes.revendas.deletar}/${id}`
          );
          const { page } = this.props.match.params;
          this.loadRevendas(page);
        } catch (err) {
          Swal.fire({
            title: "Erro!",
            text:
              "Ocorreu um erro ao deletar o registro. Por favor contate o administrador!",
            type: "error",
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  componentDidMount() {
    const { page } = this.props.match.params;
    this.loadRevendas(page);
  }

  componentDidUpdate(prevProps) {
    const { page } = this.props.match.params;
    const params = new URLSearchParams(this.props.location.search);
    const search = params.get("search");
    const paramsPrev = new URLSearchParams(prevProps.location.search);
    const searchPrev = paramsPrev.get("search");
    if (page !== prevProps.match.params.page || search !== searchPrev) {
      this.loadRevendas(page);
    }
  }

  loadRevendas = async (page) => {
    this.setState({ loading: true });
    const params = new URLSearchParams(this.props.location.search);
    const search = params.get("search");
    try {
      const response = await api.get(
        `${endpoints.cadastros.configuracoes.revendas.listar}/${page}`,
        {
          params: {
            pageSize: 10,
            search,
          },
        }
      );
      this.setState({
        loading: false,
        revendas: { ...response.data },
      });
    } catch (err) {
      this.setState({
        loading: false,
      });
      NotifyError(
        "Houve um problema ao carregar os dados, por gentileza tente novamente mais tarde."
      );
    }
  };

  deletarRevenda = (e, id) => {
    e.preventDefault();
    this.showModal(id);
  };

  handleSearch = async (e) => {
    e.preventDefault();
    const { value } = this.state;
    this.props.history.push(
      `/app/cadastros/configs/revendas/1?search=${value}`
    );
  };

  handlePageClick = (data) => {
    let page = data.selected + 1;
    this.props.history.push(`/app/cadastros/configs/revendas/${page}`);
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = async ({ value }) => {
    try {
      const response = await api.get(endpoints.suggestions.revendas, {
        params: {
          search: value,
        },
      });
      this.setState({
        suggestions: response.data.revendas.map(
          (revenda) => revenda.razao_social
        ),
      });
    } catch (err) {
      NotifyError(
        "Houve um problema ao carregar as sugestões, por gentileza tente novamente mais tarde."
      );
    }
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  getSuggestionValue = (suggestion) => suggestion;

  renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  render() {
    const { page } = this.props.match.params;
    const { revendas, loading, value, suggestions } = this.state;

    const inputProps = {
      placeholder: "Digite o nome da revenda",
      value,
      onChange: this.onChange,
    };

    return (
      <Container>
        {NotifyComponent}
        <Body>
          <BodyHeader>
            <Form onSubmit={this.handleSearch}>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
              />
              <button type="submit">
                <FontAwesomeIcon icon={faSearch} className="search" />
              </button>
            </Form>
            {(hasRole(
              permissions.cadastros.configuracoes.revendas.criar.roles
            ) ||
              isAllowed(
                permissions.cadastros.configuracoes.revendas.criar.rights
              )) && (
              <Link to="/app/cadastros/configs/revendas/create">
                <FontAwesomeIcon icon={faPlus} className="plus" /> Cadastrar
                Revenda
              </Link>
            )}
          </BodyHeader>
          <br />
          <Table>
            <thead>
              <tr>
                <th>Revenda</th>
                <th>Nome Fantasia</th>
                <th>CNPJ</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading === false &&
                revendas.revendas.map((revenda) => (
                  <tr key={revenda.id}>
                    <td>{revenda.razao_social}</td>
                    <td>{revenda.nome_fantasia}</td>
                    <td>{revenda.cnpj}</td>
                    <td>
                      <div>
                        {(hasRole(
                          permissions.cadastros.configuracoes.revendas.editar
                            .roles
                        ) ||
                          isAllowed(
                            permissions.cadastros.configuracoes.revendas.editar
                              .rights
                          )) && (
                          <Link
                            to={`/app/cadastros/configs/revendas/edit/${revenda.id}`}
                            className="btnEdit"
                          >
                            <FontAwesomeIcon icon={faEdit} className="edit" />
                            Editar
                          </Link>
                        )}
                        {(hasRole(
                          permissions.cadastros.configuracoes.revendas.deletar
                            .roles
                        ) ||
                          isAllowed(
                            permissions.cadastros.configuracoes.revendas.deletar
                              .rights
                          )) && (
                          <button
                            type="button"
                            onClick={(e) => this.deletarRevenda(e, revenda.id)}
                            className="btnDel"
                          >
                            <FontAwesomeIcon icon={faTimes} className="del" />
                            Deletar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              {(revendas.revendas.length === 0 || loading) && (
                <tr>
                  <td colSpan="4" align="center">
                    {loading === false ? (
                      "Nenhum registro localizado no sistema."
                    ) : (
                      <Loading loading={loading} message="" />
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {revendas.pages > 0 && (
            <div className="pages">
              <ReactPaginate
                initialPage={page - 1}
                previousLabel={<FontAwesomeIcon icon={faAngleDoubleLeft} />}
                nextLabel={<FontAwesomeIcon icon={faAngleDoubleRight} />}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={revendas.pages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </div>
          )}
        </Body>
      </Container>
    );
  }
}
