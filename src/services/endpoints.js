const endpoints = {
  login: "/login",
  comunicados: "/operacao/comunicados",
  estados: "/estados",
  cidades: "/cidades",
  membros: "/cadastros/membros",
  financeiro: "/cadastros/financeiro",
  natureza: "/cadastros/natureza",
  meios: "/cadastros/meios",
  fontes: "/cadastros/fontes",
  classificacoes: "/cadastros/classificacao",
  file: "/files",
  roles: "/roles",
  usuarios: "/usuarios",
  consultaCep: "/consultaCep",
  suggestions: {
    atos: "/suggestions/atos",
    revendas: "/suggestions/revendas",
    entidades: "/suggestions/entidades",
    membros: "/suggestions/membro",
    financeiro: "/suggestions/financeiro",
    natureza: "/suggestions/natureza",
    classificacao: "suggestions/classificacao",
    fontes: "suggestions/fontes",
  },
  configuracoes: {
    revendas: {
      listar: "/configs/revendas",
      enviar: "/preferencias",
    },
    entidades: {
      listar: "/configs/entidades",
      enviar: "/preferencias",
    },
  },
  cadastros: {
    configuracoes: {
      revendas: {
        listar: "/cadastros/configs/revendas/pagina",
        criar: "/cadastros/configs/revendas",
        editar: "/cadastros/configs/revendas",
        deletar: "/cadastros/configs/revendas",
      },
      entidades: {
        listar: "/cadastros/configs/entidades/pagina",
        visualizar: "/cadastros/configs/entidades",
        criar: "/cadastros/configs/entidades",
        editar: "/cadastros/configs/entidades",
        deletar: "/cadastros/configs/entidades",
      },
      usuarios: {
        listar: "/cadastros/configs/usuarios/pagina",
        criar: "/cadastros/configs/usuarios",
        editar: "/cadastros/configs/usuarios",
        deletar: "/cadastros/configs/usuarios",
      },
    },
      membros: {
        listar: "/cadastros/membros/pagina",
        criar: "/cadastros/membros",
        editar: "/cadastros/membros",
        deletar: "/cadastros/membros",
      },
      financeiro: {
        listar: "/cadastros/financeiros/pagina",
        criar: "/cadastros/financeiros",
        editar: "/cadastros/financeiros",
        deletar: "/cadastros/financeiros",
      },
      comunicado: {
        listar: "/cadastros/comunicado/pagina",
        criar: "/cadastros/comunicado",
        editar: "/cadastros/comunicado",
        deletar: "/cadastros/comunicado",
      }
  }
};

export default endpoints;
