import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Header from "../components/Header";

import {
  isAuthenticated,
  hasRole,
  isAllowed,
} from "../services/auth";
import { permissions } from "../services/permissions";

import Error404 from "../pages/Errors/404";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ListarComunicados from "../pages/Cadastros/Comunicados/ListarComunicados";
import FormComunicados from "../pages/Cadastros/Comunicados/FormComunicados";
import ListarFinanceiro from "../pages/Cadastros/Financeiro/ListarFinanceiro";
import ListarMembros from "../pages/Cadastros/Membros/ListarMembros";
import FormMembros from "../pages/Cadastros/Membros/FormMembro";


import ListarUsuarios from "../pages/Cadastros/Configuracoes/Usuarios/ListarUsuarios";
import FormUsuario from "../pages/Cadastros/Configuracoes/Usuarios/FormUsuario";

const autenticated = isAuthenticated();

const PrivateRoute = ({ component: Component, roles, rights, ...rest }) => {
  
  return (
    <Route
      {...rest}
      render={(props) =>
        !autenticated ? (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        ) : autenticated &&
          ((!roles && !rights) ||
            (roles && hasRole(roles)) ||
            (rights && isAllowed(rights))) ?  (
        <Redirect
            to={{
              pathname: "/app/cadastros/membros/1",
              state: { from: props.location },
            }}
          />
            ) : (
          <Redirect
            to={{ pathname: "/404", state: { from: props.location } }}
          />
        )
      }
    />
  )
};       



const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      !autenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/app/cadastros/membros/1",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

const Routes = () => (
  <BrowserRouter>
    <div>
      <Header />
      <Switch>
        <PublicRoute exact path="/" component={Home} />
        <PublicRoute exact path="/login" component={Login} />

        <PrivateRoute
          exact
          path="/app/cadastros/configs/usuarios/:page(\d+)"
          component={ListarUsuarios}
          roles={permissions.cadastros.configuracoes.usuarios.listar.roles}
          rights={permissions.cadastros.configuracoes.usuarios.listar.rights}
        />
        <PrivateRoute
          exact
          path="/app/cadastros/configs/usuarios/create"
          component={FormUsuario}
          roles={permissions.cadastros.configuracoes.usuarios.criar.roles}
          rights={permissions.cadastros.configuracoes.usuarios.criar.rights}
        />
        <PrivateRoute
          exact
          path="/app/cadastros/configs/usuarios/edit/:id(\d+)"
          component={FormUsuario}
          roles={permissions.cadastros.configuracoes.usuarios.editar.roles}
          rights={permissions.cadastros.configuracoes.usuarios.editar.rights}
        />
        <PrivateRoute
          exact
          path="/app/cadastros/comunicados/:page(\d+)"
          component={ListarComunicados}
          roles={permissions.cadastros.comunicados.listar.roles}
          rights={permissions.cadastros.comunicados.listar.rights}
        />
        <PrivateRoute
          exact
          path="/app/cadastros/comunicados/create"
          component={FormComunicados}
          roles={permissions.cadastros.comunicados.criar.roles}
          rights={permissions.cadastros.comunicados.criar.rights}
        />
        <PrivateRoute
          exact
          path="/app/cadastros/comunicados/edit/:id(\d+)"
          component={FormComunicados}
          roles={permissions.cadastros.comunicados.editar.roles}
          rights={permissions.cadastros.comunicados.editar.rights}
        />
        <PrivateRoute
          exact
          path="/app/cadastros/financeiro/:page(\d+)"
          component={ListarFinanceiro}
          roles={permissions.cadastros.financeiro.listar.roles}
          rights={permissions.cadastros.financeiro.listar.rights}
        />
        <PrivateRoute
          exact
          path="/app/cadastros/membros/:page(\d+)"
          component={ListarMembros}
          roles={permissions.cadastros.membros.listar.roles}
          rights={permissions.cadastros.membros.listar.rights}
        />
        <PrivateRoute
          exact
          path="/app/cadastros/membros/create"
          component={FormMembros}
          roles={permissions.cadastros.membros.listar.roles}
          rights={permissions.cadastros.membros.listar.rights}
        />
        <PrivateRoute
          exact
          path="/app/cadastros/membros/edit/:id(\d+)"
          component={FormMembros}
          roles={permissions.cadastros.membros.listar.roles}
          rights={permissions.cadastros.membros.listar.rights}
        />
        <Route path="*" component={Error404} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default Routes;
