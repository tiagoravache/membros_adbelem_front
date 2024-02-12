import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import { HeaderBar, Container, NavBar, NavLogo, NavLinks } from "./styles";
import Logo from "../../assets/images/logo.png";
import {
  isAuthenticated,
  isAllowed,
  hasRole,
  logout,
  getUser,
} from "../../services/auth";
import { permissions } from "../../services/permissions";
import api from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responsive: false,
      nome: "",
      avatar: "",
    };
  }

  componentDidMount() {
    if (isAuthenticated()) {
      const { nome, avatar } = getUser();
      console.log(avatar)
      this.setState({ nome, avatar });
    }
   
  }


  toggleClass = () => {
    const { responsive } = this.state;
    this.setState({ responsive: !responsive });
  };

  getNavLinkClass = (path) => {
    return this.props.location.pathname.includes(path) ? "active" : "";
  };

  render() {
    const { responsive, nome, avatar } = this.state;

    const profileLink = (
      <>
        {" "}
        <li
          className={`has-children ${this.getNavLinkClass(
            "/app/usuario/perfil"
          )}`}
        >
          <div className="userImg">
            <button>{nome}</button>
            <img src={api.defaults.baseURL + avatar} alt="Imagem do Perfil" />
            <FontAwesomeIcon
              icon={faChevronDown}
              className="arrow arrow-down"
            />
          </div>

          <ul>
            {/* <li>
            <NavLink to="/app/perfil">Editar Perfil</NavLink>
          </li> */}
            <li>
              <button
                className="logoutBtn"
                onClick={() => {
                  logout();
                  this.toggleClass();
                  this.setState({ activeIndex: 0 });
                  this.props.history.push("/");
                }}
              >
                Sair da Sessão
              </button>
            </li>
          </ul>
        </li>
      </>
    );
    return (
      (
        <HeaderBar>
          <Container>
            <NavBar className="navBar">
              <NavLogo>
                <NavLink to="/" className="logo">
                  <img src={Logo} alt="Sistema Legislação" />
                  <h1 className="logo">Portal de membros ADBelém</h1>
                </NavLink>
              </NavLogo>
              <NavLinks className={responsive ? "responsive" : ""}>
                {isAuthenticated() ? (
                  <ul>                    
                    {(hasRole(
                        permissions.cadastros.configuracoes.usuarios.listar
                          .roles
                      ) ||
                      isAllowed(
                        permissions.cadastros.configuracoes.usuarios.listar
                          .rights
                      ) ||
                      hasRole(permissions.cadastros.financeiro.listar.roles) ||
                      isAllowed(
                        permissions.cadastros.financeiro.listar.rights
                      )) && (
                      <li
                        className={`has-children ${this.getNavLinkClass(
                          "/app/cadastros"
                        )}`}
                      >
                        <button>
                          Cadastros
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className="arrow arrow-down"
                          />
                        </button>
                        <ul>
                          {(hasRole(
                            permissions.cadastros.membros.listar.roles
                          ) ||
                            isAllowed(
                              permissions.cadastros.membros.listar.rights
                            )) && (
                            <li>
                              <NavLink
                                to="/app/cadastros/membros/1"
                                isActive={(match, location) =>
                                  location.pathname.includes(
                                    "/app/cadastros/membros"
                                  )
                                }
                              >
                                Membros
                              </NavLink>
                            </li>
                          )}
                          {(hasRole(
                            permissions.cadastros.financeiro.listar.roles
                          ) ||
                            isAllowed(
                              permissions.cadastros.financeiro.listar.rights
                            )) && (
                            <li>
                              <NavLink
                                to="/app/cadastros/financeiro/1"
                                isActive={(match, location) =>
                                  location.pathname.includes(
                                    "/app/cadastros/financeiro"
                                  )
                                }
                              >
                                Financeiro
                              </NavLink>
                            </li>
                          )}
                          {(hasRole(permissions.cadastros.comunicados.listar.roles) ||
                            isAllowed(
                              permissions.cadastros.comunicados.listar.rights
                            )) && (
                            <li>
                              <NavLink
                                to="/app/cadastros/comunicados/1"
                                isActive={(match, location) =>
                                  location.pathname.includes(
                                    "/app/cadastros/comunicados"
                                  )
                                }
                              >
                                Comunicados
                              </NavLink>
                            </li>
                          )}
                          {(hasRole(
                              permissions.cadastros.configuracoes.usuarios
                                .listar.roles
                            ) ||
                            isAllowed(
                              permissions.cadastros.configuracoes.usuarios
                                .listar.rights
                            )) && (
                            <li
                              className={`has-children ${this.getNavLinkClass(
                                "/app/cadastros/configs"
                              )}`}
                            >
                              <button>
                                Configurações
                                <FontAwesomeIcon
                                  icon={faChevronDown}
                                  className="arrow arrow-down"
                                />
                                <FontAwesomeIcon
                                  icon={faChevronRight}
                                  className="arrow arrow-right"
                                />
                              </button>
                              <ul>
                                {(hasRole(
                                  permissions.cadastros.configuracoes.usuarios
                                    .listar.roles
                                ) ||
                                  isAllowed(
                                    permissions.cadastros.configuracoes.usuarios
                                      .listar.rights
                                  )) && (
                                  <li>
                                    <NavLink to="/app/cadastros/configs/usuarios/1">
                                      Usuários
                                    </NavLink>
                                  </li>
                                )}
                              </ul>
                            </li>
                          )}
                        </ul>
                      </li>
                    )}
                    {profileLink}
                  </ul>
                ) : isAuthenticated() ? (
                  <ul>{profileLink}</ul>
                ) : (
                  <ul>                    
                    <li>
                      <NavLink to="/login">Login</NavLink>
                    </li>
                  </ul>
                )}
              </NavLinks>
              <button className="icon" onClick={() => this.toggleClass()}>
                <FontAwesomeIcon icon={faBars} />
              </button>
            </NavBar>
          </Container>
        </HeaderBar>
      )
    );
  }
}

export default withRouter(Header);
