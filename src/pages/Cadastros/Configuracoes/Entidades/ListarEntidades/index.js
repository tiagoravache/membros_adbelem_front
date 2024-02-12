import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Body,
  BodyHeader,
  Form,
  Table
} from "../../Revendas/ListarRevendas/styles";
import Loading from "../../../../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faPlus,
  faEdit,
  faTimes
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

// import { Container } from './styles';

export default class ListarEntidades extends Component {
  state = {
    loading: false,
    entidades: {
      entidades: [],
      total: 0,
      limit: 0,
      page: 0,
      pages: 0
    },
    value: "",
    suggestions: [],
    error: ""
  };

  showModal = id => {
    MySwal.fire({
      title: "Você tem certeza?",
      text: "Você não poderá reverter esta ação!",
      type: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#e74c3c",
      confirmButtonText: "Sim, deletar!",
      cancelButtonColor: "#7777",
      cancelButtonText: "Não, cancelar!"
    }).then(async result => {
      if (result.value) {
        try {
          await api.delete(
            `${endpoints.cadastros.configuracoes.entidades.deletar}/${id}`
          );
          const { page } = this.props.match.params;
          this.loadEntidades(page);
        } catch (err) {
          Swal.fire({
            title: "Erro!",
            text:
              "Ocorreu um erro ao deletar o registro. Por favor contate o administrador!",
            type: "error",
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "OK"
          });
        }
      }
    });
  };

  componentDidMount() {
    const { page } = this.props.match.params;
    this.loadEntidades(page);
  }

  componentDidUpdate(prevProps) {
    const { page } = this.props.match.params;
    const params = new URLSearchParams(this.props.location.search);
    const search = params.get("search");
    const paramsPrev = new URLSearchParams(prevProps.location.search);
    const searchPrev = paramsPrev.get("search");
    if (page !== prevProps.match.params.page || search !== searchPrev) {
      this.loadEntidades(page);
    }
  }

  loadEntidades = async page => {
    this.setState({ loading: true });
    const params = new URLSearchParams(this.props.location.search);
    const search = params.get("search");
    try {
      const response = await api.get(
        `${endpoints.cadastros.configuracoes.entidades.listar}/${page}`,
        {
          params: {
            pageSize: 10,
            search
          }
        }
      );
      this.setState({
        loading: false,
        error: "",
        entidades: { ...response.data }
      });
    } catch (err) {
      this.setState({
        loading: false,
        error:
          "Houve um problema ao carregar os dados, por gentileza tente novamente mais tarde."
      });
    }
  };

  handleSearch = async e => {
    e.preventDefault();
    const { value } = this.state;
    this.props.history.push(
      `/app/cadastros/configs/entidades/1?search=${value}`
    );
  };

  handlePageClick = data => {
    let page = data.selected + 1;
    this.props.history.push(`/app/cadastros/configs/entidades/${page}`);
  };

  deletarEntidade = (e, id) => {
    e.preventDefault();
    this.showModal(id);
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = async ({ value }) => {
    try {
      const response = await api.get(endpoints.suggestions.entidades, {
        params: {
          search: value
        }
      });
      this.setState({
        suggestions: response.data.entidades.map(entidade => entidade.nome)
      });
    } catch (err) {
      NotifyError(
        "Houve um problema ao carregar as sugestões, por gentileza tente novamente mais tarde."
      );
    }
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  getSuggestionValue = suggestion => suggestion;

  renderSuggestion = suggestion => <div>{suggestion}</div>;

  render() {
    const { page } = this.props.match.params;
    const { entidades, loading, value, suggestions } = this.state;

    const inputProps = {
      placeholder: "Digite o nome da entidade",
      value,
      onChange: this.onChange
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
              permissions.cadastros.configuracoes.entidades.criar.roles
            ) ||
              isAllowed(
                permissions.cadastros.configuracoes.entidades.criar.rights
              )) && (
              <Link to="/app/cadastros/configs/entidades/create">
                <FontAwesomeIcon icon={faPlus} className="plus" /> Cadastrar
                Entidade
              </Link>
            )}
          </BodyHeader>
          <br />
          <Table>
            <thead>
              <tr>
                <th>Entidade</th>
                <th>Código TCE</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading === false &&
                entidades.entidades.map(entidade => (
                  <tr key={entidade.id}>
                    <td>{entidade.nome}</td>
                    <td>{entidade.codigotce}</td>
                    <td>
                      <div>
                        {(hasRole(
                          permissions.cadastros.configuracoes.entidades.editar
                            .roles
                        ) ||
                          isAllowed(
                            permissions.cadastros.configuracoes.entidades.editar
                              .rights
                          )) && (
                          <Link
                            to={`/app/cadastros/configs/entidades/edit/${entidade.id}`}
                            className="btnEdit"
                          >
                            <FontAwesomeIcon icon={faEdit} className="edit" />
                            Editar
                          </Link>
                        )}
                        {(hasRole(
                          permissions.cadastros.configuracoes.entidades.deletar
                            .roles
                        ) ||
                          isAllowed(
                            permissions.cadastros.configuracoes.entidades
                              .deletar.rights
                          )) && (
                          <button
                            type="button"
                            onClick={e => this.deletarEntidade(e, entidade.id)}
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
              {(entidades.entidades.length === 0 || loading) && (
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
          {entidades.pages > 0 && (
            <div className="pages">
              <ReactPaginate
                initialPage={page - 1}
                previousLabel={<FontAwesomeIcon icon={faAngleDoubleLeft} />}
                nextLabel={<FontAwesomeIcon icon={faAngleDoubleRight} />}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={entidades.pages}
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
