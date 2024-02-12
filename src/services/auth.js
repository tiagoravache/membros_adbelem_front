import decode from "jwt-decode";

export const auth = "@auth";

export const isAuthenticated = () => {

  console.log("chamou isAuthenticated")
  return localStorage.getItem(auth) !== null && !isTokenExpired();
}
export const isTokenExpired = () => {
  if (localStorage.getItem(auth) === null) return true;

  const { token } = JSON.parse(localStorage.getItem(auth));

  try {
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    } else return false;
  } catch (err) {
    return false;
  }
};

export const isAllowed = (rights) => {
  if (localStorage.getItem(auth) === null) return false;

  const { usuario } = JSON.parse(localStorage.getItem(auth));

  return rights.some((right) => usuario.rights.includes(right));
};

export const hasRole = (roles) => {
  if (localStorage.getItem(auth) === null) return false;

  const { usuario } = JSON.parse(localStorage.getItem(auth));

  return roles.some((role) => usuario.roles.includes(role));
};

export const getToken = () => {
  if (localStorage.getItem(auth) === null) return;

  const { token } = JSON.parse(localStorage.getItem(auth));
  return token;
};

export const getUser = () => {
  if (localStorage.getItem(auth) === null) return;

  const { usuario } = JSON.parse(localStorage.getItem(auth));
  return usuario;
};

export const atualizarRevenda = (revenda) => {
  if (localStorage.getItem(auth) === null) return;

  const session = JSON.parse(localStorage.getItem(auth));
  const data = {
    ...session,
    usuario: {
      ...session.usuario,
      preferencias: { ...session.usuario.preferencias, revenda },
    },
  };
  localStorage.setItem(auth, JSON.stringify(data));
};

export const atualizarEntidade = (entidade) => {
  if (localStorage.getItem(auth) === null) return;

  const session = JSON.parse(localStorage.getItem(auth));
  const data = {
    ...session,
    usuario: {
      ...session.usuario,
      preferencias: { ...session.usuario.preferencias, entidade },
    },
  };
  localStorage.setItem(auth, JSON.stringify(data));
};

export const atualizarEstabelecimento = (estabelecimento) => {
  if (localStorage.getItem(auth) === null) return;

  const session = JSON.parse(localStorage.getItem(auth));
  const data = {
    ...session,
    usuario: {
      ...session.usuario,
      preferencias: { ...session.usuario.preferencias, estabelecimento },
    },
  };
  localStorage.setItem(auth, JSON.stringify(data));
};

export const atualizarToken = (token) => {
  if (localStorage.getItem(auth) === null) return;

  const session = JSON.parse(localStorage.getItem(auth));
  const data = { ...session, token };
  localStorage.setItem(auth, JSON.stringify(data));
};

export const signIn = (data) => {
  localStorage.setItem(auth, JSON.stringify(data));
};

export const logout = () => {
  if (localStorage.getItem(auth) === null) return;

  localStorage.removeItem(auth);
};
