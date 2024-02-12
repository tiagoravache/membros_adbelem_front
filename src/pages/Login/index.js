import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { NotifyComponent, NotifyError } from "../../components/Notify";
import Loading from "../../components/Loading";
import Logo from "../../assets/images/logo.png";
import api from "../../services/api";
import { signIn } from "../../services/auth";
import endpoints from "../../services/endpoints";

import { Form, Container } from "./styles";

class Login extends Component {
  state = {
    loading: false,
    login: "",
    senha: "",
    errors: {
      login: {
        error: false,
        message: "",
      },
      senha: {
        error: false,
        message: "",
      },
    },
  };

  componentDidMount() {
    this.inputName.focus();
  }

  validate = (inputName) => {
    const { errors, login, senha } = this.state;

    let validate = true;

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
      (inputName && inputName === "senha" && !senha) ||
      (!inputName && !senha)
    ) {
      errors.senha.error = true;
      errors.senha.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "senha" && senha) ||
      (!inputName && senha)
    ) {
      errors.senha.error = false;
      errors.senha.message = "";
    }

    this.setState({ errors });

    return validate;
  };

  handleSignIn = async (e) => {
    e.preventDefault();
    if (this.validate()) {
      this.setState({ loading: true });
      const { login, senha } = this.state;
      try {
        const response = await api.post(endpoints.login, {
          login,
          senha,
        });
        signIn(response.data);
        this.props.history.push("/app/cadastros/membros/1");
      } catch (err) {
        this.setState({ loading: false });
        console.log(err);
        if (err.response.status === 432) {
          NotifyError(err.response.data.error);
        } else {
          NotifyError("Verifique suas credenciais.");
        }
      }
    }
  };

  render() {
    const { errors, loading } = this.state;
    return (
      <Container>
        {NotifyComponent}
        <Form onSubmit={this.handleSignIn}>
          <img src={Logo} alt="Legislação WEB" />
          <h1>Acesso ao sistema</h1>
          <input
            type="text"
            placeholder="Login"
            ref={(input) => {
              this.inputName = input;
            }}
            autoComplete="username"
            onBlur={() => {
              this.validate("login");
            }}
            onChange={(e) => this.setState({ login: e.target.value })}
            className={errors.login.error ? "error" : ""}
          />
          {errors.login.error && (
            <div className="error-message">{errors.login.message}</div>
          )}
          <input
            type="password"
            placeholder="Senha"
            autoComplete="current-password"
            onBlur={() => {
              this.validate("senha");
            }}
            onChange={(e) => this.setState({ senha: e.target.value })}
            className={errors.senha.error ? "error" : ""}
          />
          {errors.senha.error && (
            <div className="error-message">{errors.senha.message}</div>
          )}
          <button type="submit" disabled={loading}>
            {loading === false ? (
              "ENTRAR"
            ) : (
              <Loading loading={loading} message="" color="#ddd" />
            )}
          </button>
          {/* <a href="/">Esqueci a minha senha</a> */}
        </Form>
      </Container>
    );
  }
}

export default withRouter(Login);
