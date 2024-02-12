export const permissions = {
  configuracoes: {
    congregacaos: {
      roles: ["admin"],
      rights: ["configurar_congregacao"],
    },
    secretaria: {
      roles: ["admin", "congregacao"],
      rights: ["configurar_secretaria"],
    },
    membros: {
      roles: ["admin", "congregacao", "secretaria"],
      rights: ["configurar_membro"],
    },
  },
  cadastros: {
    configuracoes: {
      congregacaos: {
        listar: {
          roles: ["admin"],
          rights: ["listar_congregacaos"],
        },
        criar: {
          roles: ["admin"],
          rights: ["criar_congregacaos"],
        },
        editar: {
          roles: ["admin"],
          rights: ["editar_congregacaos"],
        },
        deletar: {
          roles: ["admin"],
          rights: ["deletar_congregacaos"],
        },
      },
      secretaria: {
        listar: {
          roles: ["admin", "congregacao"],
          rights: ["listar_secretarias"],
        },
        criar: {
          roles: ["admin", "congregacao"],
          rights: ["criar_secretarias"],
        },
        editar: {
          roles: ["admin", "congregacao"],
          rights: ["editar_secretarias"],
        },
        deletar: {
          roles: ["admin", "congregacao"],
          rights: ["deletar_secretarias"],
        },
      },
      usuarios: {
        listar: {
          roles: ["admin", "congregacao"],
          rights: ["listar_usuarios"],
        },
        criar: {
          roles: ["admin", "congregacao"],
          rights: ["criar_usuarios"],
        },
        editar: {
          roles: ["admin", "congregacao"],
          rights: ["editar_usuarios"],
        },
        deletar: {
          roles: ["admin", "congregacao"],
          rights: ["deletar_usuarios"],
        },
      },
    },
    comunicados: {
      listar: {
        roles: ["admin", "congregacao", "secretaria"],
        rights: ["listar_comunicados"],
      },
      criar: {
        roles: ["admin", "congregacao", "secretaria"],
        rights: ["criar_comunicados"],
      },
      editar: {
        roles: ["admin", "congregacao", "secretaria"],
        rights: ["editar_comunicados"],
      },
      deletar: {
        roles: ["admin", "congregacao", "secretaria"],
        rights: ["deletar_comunicados"],
      },
    },
    financeiro: {
      listar: {
        roles: ["admin", "congregacao", "secretaria"],
        rights: ["listar_financeiro"],
      },
      
    },
    membros: {
      listar: {
        roles: ["admin", "congregacao", "secretaria"],
        rights: ["listar_membros"],
      },
      criar: {
        roles: ["admin", "congregacao", "secretaria"],
        rights: ["criar_membros"],
      },
      editar: {
        roles: ["admin", "congregacao", "secretaria"],
        rights: ["editar_membros"],
      },
      deletar: {
        roles: ["admin", "congregacao", "secretaria"],
        rights: ["deletar_membros"],
      },
    },
  },
};
