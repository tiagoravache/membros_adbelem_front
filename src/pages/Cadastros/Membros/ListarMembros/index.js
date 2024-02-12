import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Body, BodyHeader, Form, Table } from "./styles";
import Loading from "../../../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faPlus,
  faEdit,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../../../services/api";
import endpoints from "../../../../services/endpoints";
import { hasRole, isAllowed } from "../../../../services/auth";
import { permissions } from "../../../../services/permissions";
import { NotifyComponent, NotifyError } from "../../../../components/Notify";
import ReactPaginate from "react-paginate";
import Autosuggest from "react-autosuggest";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default class Membros extends Component {
  state = {
    loading: false,
    membros: {
      membros: [],
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
          await api.delete(`${endpoints.cadastros.membros.deletar}/${id}`);
          const { page } = this.props.match.params;
          this.loadModulos(page);
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
    console.log("Membros DidMount")
    const { page } = this.props.match.params;
    this.loadModulos(page);
  }

  componentDidUpdate(prevProps) {
    console.log("Membros DidUpdate")
    const { page } = this.props.match.params;
    const params = new URLSearchParams(this.props.location.search);
    const search = params.get("search");
    const paramsPrev = new URLSearchParams(prevProps.location.search);
    const searchPrev = paramsPrev.get("search");
    if (page !== prevProps.match.params.page || search !== searchPrev) {
      this.loadModulos(page);
    }
  }

  loadModulos = async (page) => {
    this.setState({ loading: true });
    const params = new URLSearchParams(this.props.location.search);
    const search = params.get("search");
    try {
      const response = await api.get(
        `${endpoints.cadastros.membros.listar}/${page}`,
        {
          params: {
            pageSize: 10,
            search,
          },
        }
      );
      this.setState({
        loading: false,
        membros: { ...response.data },
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

  deletarModulo = (e, id) => {
    e.preventDefault();
    this.showModal(id);
  };

  handleSearch = async (e) => {
    e.preventDefault();
    const { value } = this.state;
    this.props.history.push(`/app/cadastros/membros/1?search=${value}`);
  };

  handlePageClick = (data) => {
    let page = data.selected + 1;
    this.props.history.push(`/app/cadastros/membros/${page}`);
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = async ({ value }) => {
    try {
      const response = await api.get(endpoints.suggestions.membros, {
        params: {
          search: value,
        },
      });
      this.setState({
        suggestions: response.data.membros.map((membro) => membro.descricao),
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
    const { membros, loading, value, suggestions } = this.state;

    const inputProps = {
      placeholder: "Digite a descrição da membro",
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
            {(hasRole(permissions.cadastros.membros.criar.roles) ||
              isAllowed(permissions.cadastros.membros.criar.rights)) && (
              <Link to="/app/cadastros/membros/create">
                <FontAwesomeIcon icon={faPlus} className="plus" /> Cadastrar
                Modulo
              </Link>
            )}
          </BodyHeader>
          <br />
          <Table>
            <thead>
              <tr>
                <th>Modulo</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading === false &&
                membros.membros.map((membro) => (
                  <tr key={membro.id}>
                    <td>{membro.descricao}</td>
                    <td>
                      <div>
                        {(hasRole(permissions.cadastros.membros.editar.roles) ||
                          isAllowed(
                            permissions.cadastros.membros.editar.rights
                          )) && (
                          <Link
                            to={`/app/cadastros/membros/edit/${membro.id}`}
                            className="btnEdit"
                          >
                            <FontAwesomeIcon icon={faEdit} className="edit" />
                            Editar
                          </Link>
                        )}
                        {(hasRole(
                          permissions.cadastros.membros.deletar.roles
                        ) ||
                          isAllowed(
                            permissions.cadastros.membros.deletar.rights
                          )) && (
                          <button
                            type="button"
                            onClick={(e) => this.deletarModulo(e, membro.id)}
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
              {(membros.membros.length === 0 || loading) && (
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
          {membros.pages > 0 && (
            <div className="pages">
              <ReactPaginate
                initialPage={page - 1}
                previousLabel={<FontAwesomeIcon icon={faAngleDoubleLeft} />}
                nextLabel={<FontAwesomeIcon icon={faAngleDoubleRight} />}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={membros.pages}
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
