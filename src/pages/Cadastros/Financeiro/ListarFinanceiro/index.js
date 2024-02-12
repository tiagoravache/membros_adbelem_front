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

export default class Financeiros extends Component {
  state = {
    loading: false,
    financeiros: {
      financeiros: [],
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
          await api.delete(`${endpoints.cadastros.atos.financeiro.deletar}/${id}`);
          const { page } = this.props.match.params;
          this.loadFinanceiros(page);
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
    this.loadFinanceiros(page);
  }

  componentDidUpdate(prevProps) {
    const { page } = this.props.match.params;
    const params = new URLSearchParams(this.props.location.search);
    const search = params.get("search");
    const paramsPrev = new URLSearchParams(prevProps.location.search);
    const searchPrev = paramsPrev.get("search");
    if (page !== prevProps.match.params.page || search !== searchPrev) {
      this.loadFinanceiros(page);
    }
  }

  loadFinanceiros = async (page) => {
    this.setState({ loading: true });
    const params = new URLSearchParams(this.props.location.search);
    const search = params.get("search");
    try {
      const response = await api.get(
        `${endpoints.cadastros.atos.financeiro.listar}/${page}`,
        {
          params: {
            pageSize: 10,
            search,
          },
        }
      );
      this.setState({
        loading: false,
        financeiros: { ...response.data },
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

  deletarFinanceiro = (e, id) => {
    e.preventDefault();
    this.showModal(id);
  };

  handleSearch = async (e) => {
    e.preventDefault();
    const { value } = this.state;
    this.props.history.push(`/app/cadastros/financeiros/1?search=${value}`);
  };

  handlePageClick = (data) => {
    let page = data.selected + 1;
    this.props.history.push(`/app/cadastros/financeiros/${page}`);
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = async ({ value }) => {
    try {
      const response = await api.get(endpoints.suggestions.financeiros, {
        params: {
          search: value,
        },
      });
      this.setState({
        suggestions: response.data.financeiros.map((financeiro) => financeiro.descricao),
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
    const { financeiros, loading, value, suggestions } = this.state;

    const inputProps = {
      placeholder: "Digite a descrição da financeiro",
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
            {(hasRole(permissions.cadastros.financeiros.criar.roles) ||
              isAllowed(permissions.cadastros.financeiros.criar.rights)) && (
              <Link to="/app/cadastros/financeiros/create">
                <FontAwesomeIcon icon={faPlus} className="plus" /> Cadastrar
                Financeiro
              </Link>
            )}
          </BodyHeader>
          <br />
          <Table>
            <thead>
              <tr>
                <th>Financeiro</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading === false &&
                financeiros.financeiros.map((financeiro) => (
                  <tr key={financeiro.id}>
                    <td>{financeiro.descricao}</td>
                    <td>
                      <div>
                        {(hasRole(permissions.cadastros.financeiros.editar.roles) ||
                          isAllowed(
                            permissions.cadastros.financeiros.editar.rights
                          )) && (
                          <Link
                            to={`/app/cadastros/financeiros/edit/${financeiro.id}`}
                            className="btnEdit"
                          >
                            <FontAwesomeIcon icon={faEdit} className="edit" />
                            Editar
                          </Link>
                        )}
                        {(hasRole(permissions.cadastros.financeiros.deletar.roles) ||
                          isAllowed(
                            permissions.cadastros.financeiros.deletar.rights
                          )) && (
                          <button
                            type="button"
                            onClick={(e) => this.deletarFinanceiro(e, financeiro.id)}
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
              {(financeiros.financeiros.length === 0 || loading) && (
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
          {financeiros.pages > 0 && (
            <div className="pages">
              <ReactPaginate
                initialPage={page - 1}
                previousLabel={<FontAwesomeIcon icon={faAngleDoubleLeft} />}
                nextLabel={<FontAwesomeIcon icon={faAngleDoubleRight} />}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={financeiros.pages}
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
