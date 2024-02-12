import React, { Component } from "react";
import {
  Container,
  Header,
  Form,
  GroupRow,
  GroupColumn,
  InputGroup,
  UploadGroup,
  BarraProgresso,
  CheckBoxGroup
} from "./styles";
import trLocale from "moment/locale/pt-br";
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import InputMask from "react-input-mask";
import { NotifyComponent, NotifyError } from "../../../../../components/Notify";
import api from "../../../../../services/api";
import endpoints from "../../../../../services/endpoints";

export default class FormUsuario extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nome: "",
      login: "",
      ativo: true,
      previewAvatar: "",
      avatar: "",
      senha: "",
      confirmacao: "",
      email: "",
      forcaSenha: 0,
      forcaSenhaTexto: "",
      emEdicao: false,
      roles: [],
      role: 0,
      errors: {
        nome: {
          error: false,
          message: ""
        },
        login: {
          error: false,
          message: ""
        },
        senha: {
          error: false,
          message: ""
        },
        confirmacao: {
          error: false,
          message: ""
        },
        email: {
          error: false,
          message: ""
        }
      }
    };
  }

  componentDidMount() {
    moment.updateLocale("pt-br", trLocale);
    const { id } = this.props.match.params;
    if (id) {
      this.loadUsuario(id);
      this.setState({ emEdicao: true });
    }
    this.loadRoles();
  }

  capitalize = str => {
    let capitalizada = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalizada;
  };

  loadUsuario = async id => {
    try {
      const response = await api.get(
        `${endpoints.cadastros.configuracoes.usuarios.editar}/${id}`
      );
      this.setState({
        nome: response.data.usuario.nome,
        login: response.data.usuario.login,
        ativo: response.data.usuario.ativo,
        email: response.data.usuario.email,
        previewAvatar: response.data.usuario.avatar
          ? `${api.defaults.baseURL}${endpoints.file}/${response.data.usuario.avatar}`
          : "",
        role: response.data.roles[0].id
      });
    } catch (err) {
      NotifyError(
        "Houve um problema ao carregar os dados, por gentileza tente novamente mais tarde."
      );
    }
  };

  loadRoles = async () => {
    try {
      const response = await api.get(endpoints.roles);
      this.setState({ roles: response.data.roles });
    } catch (err) {
      NotifyError(
        "Houve um problema ao carregar os cartórios, por gentileza tente novamente mais tarde."
      );
    }
  };

  handleAvatar = e => {
    e.preventDefault();
    this.setState({
      previewAvatar: URL.createObjectURL(e.target.files[0]),
      avatar: e.target.files[0]
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { nome, login, ativo, avatar, senha, email, role } = this.state;
    if (this.validate()) {
      try {
        const header = {
          Accept: "application/json",
          "Content-Type": "multipart/form-data"
        };
        const formData = new FormData();
        formData.append("avatar", avatar);
        formData.append("nome", nome);
        formData.append("login", login);
        formData.append("ativo", ativo);
        formData.append("senha", senha);
        formData.append("email", email);
        formData.append("role", role);
        await api.postOrPut(
          endpoints.cadastros.configuracoes.usuarios.criar,
          id,
          formData,
          header
        );
        this.props.history.push("/app/cadastros/configs/usuarios/1");
      } catch (err) {
        NotifyError(
          "Ocorreu um erro ao salvar o estabelecimento! Por favor contate o administrador"
        );
        console.log(err);
      }
    }
  };

  validate = inputName => {
    const {
      errors,
      nome,
      login,
      senha,
      confirmacao,
      email,
      emEdicao
    } = this.state;

    let validate = true;

    if ((inputName && inputName === "nome" && !nome) || (!inputName && !nome)) {
      errors.nome.error = true;
      errors.nome.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "nome" && nome) ||
      (!inputName && nome)
    ) {
      errors.nome.error = false;
      errors.nome.message = "";
    }

    if (
      (inputName && inputName === "login" && !login) ||
      (!inputName && !login)
    ) {
      errors.login.error = true;
      errors.login.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "login" && login) ||
      (!inputName && login)
    ) {
      errors.login.error = false;
      errors.login.message = "";
    }

    if (
      (inputName && inputName === "senha" && !senha && !emEdicao) ||
      (!inputName && !senha && !emEdicao)
    ) {
      errors.senha.error = true;
      errors.senha.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "senha" && senha.length < 8 && emEdicao) ||
      (!inputName && !senha && !emEdicao)
    ) {
      errors.senha.error = true;
      errors.senha.message = "A senha deve conter no mínimo 8 caracteres!";
      validate = false;
    } else if (
      (inputName && inputName === "senha" && senha) ||
      (!inputName && senha)
    ) {
      errors.senha.error = false;
      errors.senha.message = "";
    }

    if (
      (inputName && inputName === "confirmacao" && !confirmacao && !emEdicao) ||
      (!inputName && !confirmacao && !emEdicao)
    ) {
      errors.confirmacao.error = true;
      errors.confirmacao.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName &&
        inputName === "confirmacao" &&
        confirmacao !== senha &&
        !emEdicao) ||
      (!inputName && !confirmacao && !emEdicao)
    ) {
      errors.confirmacao.error = true;
      errors.confirmacao.message = "A senha digitada não confere verifique!";
      validate = false;
    } else if (
      (inputName && inputName === "confirmacao" && confirmacao) ||
      (!inputName && confirmacao)
    ) {
      errors.confirmacao.error = false;
      errors.confirmacao.message = "";
    }

    if (
      (inputName && inputName === "email" && !email) ||
      (!inputName && !email)
    ) {
      errors.email.error = true;
      errors.email.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "email" && !this.IsEmail(email)) ||
      (!inputName && !email)
    ) {
      errors.email.error = true;
      errors.email.message = "Email inválido!";
      validate = false;
    } else if (
      (inputName && inputName === "email" && email) ||
      (!inputName && email)
    ) {
      errors.email.error = false;
      errors.email.message = "";
    }

    this.setState({ errors });

    return validate;
  };

  validaForcaSenha = senha => {
    let forca = 0;
    if (senha.match(/[a-zA-Z0-9][a-zA-Z0-9]+/)) {
      forca += 1;
      console.log("azAZ09");
    }
    if (senha.match(/[~<>?]+/)) {
      forca += 1;
      console.log("~<>?");
    }
    if (senha.match(/[!@#$%*()ºª€°¬¢£]+/)) {
      forca += 1;
      console.log("especiais");
    }
    if (senha.length > 7) {
      forca += 1;
      console.log("Maior que 7");
    }
    switch (forca) {
      case 0:
        this.setState({ forcaSenha: 0, forcaSenhaTexto: "" });
        break;
      case 1:
        this.setState({ forcaSenha: 25, forcaSenhaTexto: "Fraca" });
        break;
      case 2:
        this.setState({ forcaSenha: 50, forcaSenhaTexto: "Média" });
        break;
      case 3:
        this.setState({ forcaSenha: 75, forcaSenhaTexto: "Boa" });
        break;
      case 4:
        this.setState({ forcaSenha: 100, forcaSenhaTexto: "Forte" });
        break;
      default:
        this.setState({ forcaSenha: 0, forcaSenhaTexto: "" });
        break;
    }
  };

  retornaNomeClasse = forcaSenha => {
    switch (forcaSenha) {
      case 25:
        return "fraca";
      case 50:
        return "media";
      case 75:
        return "boa";
      case 100:
        return "forte";
      default:
        return "";
    }
  };

  IsEmail = email => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  render() {
    const {
      id,
      nome,
      login,
      ativo,
      previewAvatar,
      senha,
      forcaSenha,
      forcaSenhaTexto,
      confirmacao,
      errors,
      email,
      roles,
      role
    } = this.state;

    return (
      <Container>
        {NotifyComponent}
        <Form
          onSubmit={this.handleSubmit}
          method="post"
          encType="multipart/form-data"
        >
          <input type="hidden" id="id" name="id" value={id} />
          <Header>
            <h1>Cadastrar usuário</h1>
            <button type="submit">Salvar</button>
          </Header>
          <hr />
          <GroupRow>
            <GroupColumn>
              <InputGroup>
                <label htmlFor="nome">Usuario</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  onBlur={() => {
                    this.validate("nome");
                  }}
                  onChange={e => this.setState({ nome: e.target.value })}
                  className={errors.nome.error ? "error" : ""}
                  value={nome || ""}
                />
                {errors.nome.error && (
                  <div className="error-message">{errors.nome.message}</div>
                )}
              </InputGroup>
              <InputGroup>
                <label htmlFor="login">Login</label>
                <InputMask
                  type="text"
                  id="login"
                  name="login"
                  onBlur={() => {
                    this.validate("login");
                  }}
                  onChange={e => this.setState({ login: e.target.value })}
                  className={errors.login.error ? "error" : ""}
                  value={login || ""}
                />
                {errors.login.error && (
                  <div className="error-message">{errors.login.message}</div>
                )}
              </InputGroup>
              <InputGroup>
                <label htmlFor="email">E-mail</label>
                <InputMask
                  type="text"
                  id="email"
                  name="email"
                  onBlur={() => {
                    this.validate("email");
                  }}
                  onChange={e => this.setState({ email: e.target.value })}
                  className={errors.email.error ? "error" : ""}
                  value={email || ""}
                />
                {errors.email.error && (
                  <div className="error-message">{errors.email.message}</div>
                )}
              </InputGroup>
              <InputGroup>
                <label htmlFor="role">Perfil</label>
                <select
                  id="role"
                  name="role"
                  onChange={e => this.setState({ role: e.target.value })}
                  value={role || ""}
                >
                  <option value="">Selecione</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {this.capitalize(role.descricao)}
                    </option>
                  ))}
                </select>
              </InputGroup>
              <CheckBoxGroup>
                <input
                  type="checkbox"
                  id="ativo"
                  name="ativo"
                  onChange={e => this.setState({ ativo: !ativo })}
                  checked={ativo || false}
                />
                <label htmlFor="ativo">Ativo</label>
              </CheckBoxGroup>
              <InputGroup>
                <label htmlFor="senha">Senha</label>
                <InputMask
                  type="password"
                  id="senha"
                  name="senha"
                  onBlur={() => {
                    this.validate("senha");
                  }}
                  onChange={e => {
                    this.setState({ senha: e.target.value });
                    this.validaForcaSenha(e.target.value);
                  }}
                  className={errors.senha.error ? "error" : ""}
                  value={senha || ""}
                />
                {errors.senha.error && (
                  <div className="error-message">{errors.senha.message}</div>
                )}
              </InputGroup>
              <BarraProgresso>
                <meter
                  min="0"
                  max="100"
                  value={forcaSenha}
                  id="forcaSenha"
                  className={this.retornaNomeClasse(forcaSenha)}
                />
                <span>{forcaSenhaTexto}</span>
              </BarraProgresso>
              <InputGroup>
                <label htmlFor="confirmacao">Confirme a senha</label>
                <InputMask
                  type="password"
                  id="confirmacao"
                  name="confirmacao"
                  onBlur={() => {
                    this.validate("confirmacao");
                  }}
                  onChange={e => this.setState({ confirmacao: e.target.value })}
                  className={errors.confirmacao.error ? "error" : ""}
                  value={confirmacao || ""}
                />
                {errors.confirmacao.error && (
                  <div className="error-message">
                    {errors.confirmacao.message}
                  </div>
                )}
              </InputGroup>
            </GroupColumn>
            <UploadGroup>
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={this.handleAvatar}
              />
              <label htmlFor="avatar">
                <span>Adicionar Avatar</span>
              </label>
              <img
                src={previewAvatar}
                alt="Avatar"
                className={previewAvatar === "" ? "hide" : ""}
              />
              <FontAwesomeIcon
                icon={faImage}
                className={`faImage ${previewAvatar !== "" ? "hide" : ""}`}
              />
            </UploadGroup>
          </GroupRow>
        </Form>
      </Container>
    );
  }
}
