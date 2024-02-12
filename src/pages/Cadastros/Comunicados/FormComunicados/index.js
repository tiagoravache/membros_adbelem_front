import React, { Component } from "react";
import {
  Container,
  Header,
  Form,
  GroupRow,
  GroupColumn,
  InputGroup,
  
} from "./styles";
import "react-datetime/css/react-datetime.css";
import {
  NotifyComponent,
  NotifyError,
} from "../../../../components/Notify";
import api from "../../../../services/api";
import endpoints from "../../../../services/endpoints";


export default class Comunicados extends Component {
  constructor(props) {
    super(props);
    this.metragemRef = React.createRef();

    this.state = {
      modulo_id: null,
      descricao: null,
      modulos: [],
      errors: {
        descricao: {
          error: false,
          message: "",
        },
        modulo_id: {
          error: false,
          message: "",
        },
      },
    };
  }

  componentDidMount() {
    this.loadModulos();
    const { id } = this.props.match.params;
    if (id) {
      this.loadNatureza(id);
    }
  }

  loadComunicados = async (id) => {
    try {
      const response = await api.get(
        `${endpoints.cadastros.atos.comunicados.editar}/${id}`
      );
      this.setState({
        descricao: response.data.descricao,
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

  handleSubmit = async (e) => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { descricao, modulo_id } = this.state;
    if (this.validate()) {
      try {
        await api.postOrPut(endpoints.cadastros.atos.comunicados.criar, id, {
          descricao,
          modulo_id,
        });
        this.props.history.push("/app/cadastros/comunicados/1");
      } catch (err) {
        NotifyError(
          "Ocorreu um erro ao salvar a comunicados! Por favor contate o administrador"
        );
      }
    }
  };

  validate = (inputName) => {
    const { errors, modulo_id, descricao } = this.state;

    let validate = true;

    if (
      (inputName && inputName === "modulo_id" && !modulo_id) ||
      (!inputName && !modulo_id)
    ) {
      errors.modulo_id.error = true;
      errors.modulo_id.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "modulo_id" && modulo_id) ||
      (!inputName && modulo_id)
    ) {
      errors.modulo_id.error = false;
      errors.modulo_id.message = "";
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

    this.setState({ errors });

    return validate;
  };

  handleModuloChange = (e) => {
    this.setState({
      modulo_id: e.target.value,
    });
  };

  render() {
    const { id, descricao, modulo_id, modulos, errors } = this.state;

    return (
      <Container>
        {NotifyComponent}
        <Form onSubmit={this.handleSubmit} method="post">
          <input type="hidden" id="id" name="id" value={id} />
          <Header>
            <h1>Cadastrar comunicados</h1>
            <div>
              <button type="submit">Salvar</button>
            </div>
          </Header>
          <hr />
          <GroupRow>
            <GroupColumn>
              <InputGroup>
                <label htmlFor="modulo_id">Selecione o modulo</label>
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
