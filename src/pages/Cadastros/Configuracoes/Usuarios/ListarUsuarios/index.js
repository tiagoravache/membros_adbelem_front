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

export default class Usuarios extends Component {
  state = {
    loading: false,
    usuarios: {
      usuarios: [],
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
            `${endpoints.cadastros.configuracoes.usuarios.deletar}/${id}`
          );
          const { page } = this.props.match.params;
          this.loadUsuarios(page);
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
    this.loadUsuarios(page);
  }

  componentDidUpdate(prevProps) {
    const { page } = this.props.match.params;
    const params = new URLSearchParams(this.props.location.search);
    const search = params.get("search");
    const paramsPrev = new URLSearchParams(prevProps.location.search);
    const searchPrev = paramsPrev.get("search");
    if (page !== prevProps.match.params.page || search !== searchPrev) {
      this.loadUsuarios(page);
    }
  }

  loadUsuarios = async (page) => {
    this.setState({ loading: true });
    const params = new URLSearchParams(this.props.location.search);
    const search = params.get("search");
    try {
      const response = await api.get(
        `${endpoints.cadastros.configuracoes.usuarios.listar}/${page}`,
        {
          params: {
            pageSize: 10,
            search,
          },
        }
      );
      console.log(response.data);
      this.setState({
        loading: false,
        usuarios: { ...response.data },
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

  deletarUsuario = (e, id) => {
    e.preventDefault();
    this.showModal(id);
  };

  handleSearch = async (e) => {
    e.preventDefault();
    const { value } = this.state;
    this.props.history.push(
      `/app/cadastros/configs/usuarios/1?search=${value}`
    );
  };

  handlePageClick = (data) => {
    let page = data.selected + 1;
    this.props.history.push(`/app/cadastros/configs/usuarios/${page}`);
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = async ({ value }) => {
    try {
      const response = await api.get(endpoints.suggestions.usuarios, {
        params: {
          search: value,
        },
      });
      this.setState({
        suggestions: response.data.usuarios.map((usuario) => usuario.nome),
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
    const { usuarios, loading, value, suggestions } = this.state;

    const inputProps = {
      placeholder: "Digite o nome do usuario",
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
              permissions.cadastros.configuracoes.usuarios.criar.roles
            ) ||
              isAllowed(
                permissions.cadastros.configuracoes.usuarios.criar.rights
              )) && (
              <Link to="/app/cadastros/configs/usuarios/create">
                <FontAwesomeIcon icon={faPlus} className="plus" /> Cadastrar
                Usuario
              </Link>
            )}
          </BodyHeader>
          <br />
          <Table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Entidade</th>
                <th>Estabelecimento</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading === false &&
                usuarios.usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nome}</td>
                    <td>
                      {usuario.preferencias
                        ? usuario.preferencias.entidade.nome
                        : ""}
                    </td>
                    <td>
                      {usuario.preferencias
                        ? usuario.preferencias.estabelecimento.nome
                        : ""}
                    </td>
                    <td>
                      <div>
                        {(hasRole(
                          permissions.cadastros.configuracoes.usuarios.editar
                            .roles
                        ) ||
                          isAllowed(
                            permissions.cadastros.configuracoes.usuarios.editar
                              .rights
                          )) && (
                          <Link
                            to={`/app/cadastros/configs/usuarios/edit/${usuario.id}`}
                            className="btnEdit"
                          >
                            <FontAwesomeIcon icon={faEdit} className="edit" />
                            Editar
                          </Link>
                        )}
                        {(hasRole(
                          permissions.cadastros.configuracoes.usuarios.deletar
                            .roles
                        ) ||
                          isAllowed(
                            permissions.cadastros.configuracoes.usuarios.deletar
                              .rights
                          )) && (
                          <button
                            type="button"
                            onClick={(e) => this.deletarUsuario(e, usuario.id)}
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
              {(usuarios.usuarios.length === 0 || loading) && (
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
          {usuarios.pages > 0 && (
            <div className="pages">
              <ReactPaginate
                initialPage={page - 1}
                previousLabel={<FontAwesomeIcon icon={faAngleDoubleLeft} />}
                nextLabel={<FontAwesomeIcon icon={faAngleDoubleRight} />}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={usuarios.pages}
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
