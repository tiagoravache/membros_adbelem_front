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


export default class Membros extends Component {
  constructor(props) {
    super(props);
    this.metragemRef = React.createRef();

    this.state = {
      descricao: null,
      errors: {
        descricao: {
          error: false,
          message: "",
        },
      },
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      this.loadMembros(id);
    }
  }

  loadMembros = async (id) => {
    try {
      const response = await api.get(
        `${endpoints.cadastros.atos.membros.editar}/${id}`
      );
      this.setState({
        descricao: response.data.descricao,
      });
    } catch (err) {
      NotifyError(
        "Houve um problema ao carregar os dados, por gentileza tente novamente mais tarde."
      );
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { descricao } = this.state;
    if (this.validate()) {
      try {
        await api.postOrPut(endpoints.cadastros.atos.Membros.criar, id, {
          descricao,
        });
        this.props.history.push("/app/cadastros/Membros/1");
      } catch (err) {
        NotifyError(
          "Ocorreu um erro ao salvar o membro! Por favor contate o administrador"
        );
      }
    }
  };

  validate = (inputName) => {
    const { errors, descricao } = this.state;

    let validate = true;

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

  render() {
    const { id, descricao, errors } = this.state;

    return (
      <Container>
        {NotifyComponent}
        <Form onSubmit={this.handleSubmit} method="post">
          <input type="hidden" id="id" name="id" value={id} />
          <Header>
            <h1>Cadastrar membro</h1>
            <div>
              <button type="submit">Salvar</button>
            </div>
          </Header>
          <hr />
          <GroupRow>
            <GroupColumn>
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
