import React, { Component } from "react";
import {
  Container,
  Header,
  Form,
  GroupRow,
  GroupColumn,
  InputGroup,
  Table,
  FileCustom,
  CheckBoxGroup,
} from "./styles";
import "react-datetime/css/react-datetime.css";
import {
  NotifyComponent,
  NotifyError,
  NotifyWarn,
} from "../../../../components/Notify";

import api from "../../../../services/api";
import endpoints from "../../../../services/endpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { permissions } from "../../../../services/permissions";
import { hasRole, isAllowed } from "../../../../services/auth";

const MySwal = withReactContent(Swal);

export default class Financeiros extends Component {
  constructor(props) {
    super(props);
    this.metragemRef = React.createRef();

    this.state = {
      modulos: [],
      classificacoes: [],
      modulo_id: null,
      classificacao_id: null,
      descricao: null,
      errors: {
        descricao: {
          error: false,
          message: "",
        },
        classificacao_id: {
          error: false,
          message: "",
        },
      },
    };
  }

  componentDidMount() {
    this.loadModulos();
    this.loadClassificacoes();
    const { id } = this.props.match.params;
    if (id) {
      this.loadFinanceiro(id);
    }
  }

  loadFinanceiro = async (id) => {
    try {
      const response = await api.get(
        `${endpoints.cadastros.cemiterio.financeiro.editar}/${id}`
      );
      this.setState({
        descricao: response.data.descricao,
        classificacao_id: response.data.classificacao_id,
        modulo_id: response.data.modulo_id,
      });
    } catch (err) {
      NotifyError(
        "Houve um problema ao carregar os dados, por gentileza tente novamente mais tarde."
      );
    }
  };

  loadModulos = async () => {
    try {
      const response = await api.get(endpoints.modulos);
      this.setState({ modulos: response.data.modulos });
    } catch (err) {
      NotifyError("Erro ao carregar modulos!");
    }
  };

  loadClassificacoes = async () => {
    try {
      const response = await api.get(endpoints.classificacoes);
      this.setState({ classificacoes: response.data.classificacoes });
    } catch (err) {
      NotifyError("Erro ao carregar classificações!");
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { descricao, modulo_id, classificacao_id } = this.state;
    if (this.validate()) {
      try {
        await api.postOrPut(endpoints.cadastros.atos.financeiro.criar, id, {
          descricao,
          modulo_id,
          classificacao_id,
        });
        this.props.history.push("/app/cadastros/financeiros/1");
      } catch (err) {
        console.log(err);
        NotifyError(
          "Ocorreu um erro ao salvar o financeiro de ato! Por favor contate o administrador"
        );
      }
    }
  };

  validate = (inputName) => {
    const { errors, classificacao_id, descricao, metragem } = this.state;

    let validate = true;

    if (
      (inputName && inputName === "classificacao_id" && !classificacao_id) ||
      (!inputName && !classificacao_id)
    ) {
      errors.classificacao_id.error = true;
      errors.classificacao_id.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "classificacao_id" && classificacao_id) ||
      (!inputName && classificacao_id)
    ) {
      errors.classificacao_id.error = false;
      errors.classificacao_id.message = "";
    }

    if (
      (inputName && inputName === "descricao" && !descricao) ||
      (!inputName && !descricao)
    ) {
      errors.descricao.error = true;
      errors.descricao.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "descricao" && descricao) ||
      (!inputName && descricao)
    ) {
      errors.descricao.error = false;
      errors.descricao.message = "";
    }

    if (
      (inputName === "metragem" && metragem === "0.00") ||
      (!inputName && metragem === "0.00")
    ) {
      errors.metragem.error = true;
      errors.metragem.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "metragem" && parseInt(metragem) > 0) ||
      (!inputName && metragem)
    ) {
      errors.metragem.error = false;
      errors.metragem.message = "";
    }

    this.setState({ errors });

    return validate;
  };

  handleModuloChange = (e) => {
    this.setState({
      modulo_id: e.target.value,
    });
  };

  render() {
    const {
      id,
      descricao,
      modulo_id,
      classificacao_id,
      modulos,
      classificacoes,
      errors,
    } = this.state;

    return (
      <Container>
        {NotifyComponent}
        <Form onSubmit={this.handleSubmit} method="post">
          <input type="hidden" id="id" name="id" value={id} />
          <Header>
            <h1>Cadastrar financeiro da ato legislativo</h1>
            <div>
              <button type="submit">Salvar</button>
            </div>
          </Header>
          <hr />
          <GroupRow>
            <GroupColumn>
              <InputGroup>
                <label htmlFor="modulo_id">Selecione o módulo</label>
                <select
                  id="modulo_id"
                  name="modulo_id"
                  ref={(input) => {
                    this.inputName = input;
                  }}
                  onChange={this.handleModuloChange}
                  value={modulo_id || ""}
                >
                  <option value="">Selecione</option>
                  {modulos.map((modulo) => (
                    <option key={modulo.id} value={modulo.id}>
                      {modulo.descricao}
                    </option>
                  ))}
                </select>
              </InputGroup>
              <InputGroup>
                <label htmlFor="classificacao_id">
                  Selecione a classificação
                </label>
                <select
                  id="classificacao_id"
                  name="classificacao_id"
                  onBlur={() => {
                    this.validate("classificacao_id");
                  }}
                  onChange={(e) =>
                    this.setState({
                      classificacao_id: e.target.value,
                    })
                  }
                  className={errors.classificacao_id.error ? "error" : ""}
                  value={classificacao_id || ""}
                >
                  <option value="">Selecione</option>
                  {classificacoes.map((classificacao) => (
                    <option key={classificacao.id} value={classificacao.id}>
                      {classificacao.descricao}
                    </option>
                  ))}
                </select>
                {errors.classificacao_id.error && (
                  <div className="error-message">
                    {errors.classificacao_id.message}
                  </div>
                )}
              </InputGroup>
              <InputGroup>
                <label htmlFor="descricao">Descrição</label>
                <input
                  type="text"
                  id="descricao"
                  name="descricao"
                  onBlur={() => {
                    this.validate("descricao");
                  }}
                  onChange={(e) => this.setState({ descricao: e.target.value })}
                  className={errors.descricao.error ? "error" : ""}
                  value={descricao || ""}
                />
                {errors.descricao.error && (
                  <div className="error-message">
                    {errors.descricao.message}
                  </div>
                )}
              </InputGroup>
            </GroupColumn>
          </GroupRow>
        </Form>
      </Container>
    );
  }
}
