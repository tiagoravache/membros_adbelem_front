import React, { Component } from "react";
import {
  Container,
  Header,
  Form,
  GroupRow,
  GroupColumn,
  InputGroup,
  UploadGroup,
  Table,
  CheckBoxGroup,
} from "./styles";
import trLocale from "moment/locale/pt-br";
import moment from "moment";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import InputMask from "react-input-mask";
import {
  NotifyComponent,
  NotifyError,
  NotifyWarn,
} from "../../../../../components/Notify";
import Tabs from "../../../../../components/Tabs";
import api from "../../../../../services/api";
import endpoints from "../../../../../services/endpoints";
import { tipoDocumento, tipoContato } from "../../../../../services/enums";

export default class FormEntidades extends Component {
  constructor(props) {
    super(props);
    this.uf_id = React.createRef();
    this.cidade_id = React.createRef();
    this.banco_id = React.createRef();

    this.state = {
      nome: null,
      token_integracao: null,
      codigotce: null,
      cnpj: null,
      ativo: false,
      previewLogo: "",
      logo: "",
      documento: {
        data_emissao: null,
        numero: null,
        orgao_emissor: null,
        tipo_documento: null,
        uf_emissor_id: null,
      },
      documentos: [],
      contato: {
        tipo_contato: null,
        contato: null,
      },
      contatos: [],
      endereco: {
        cep: null,
        logradouro: null,
        numero: null,
        complemento: null,
        bairro: null,
        cidade_id: null,
      },
      enderecos: [],
      errors: {
        nome: {
          error: false,
          message: "",
        },
        cnpj: {
          error: false,
          message: "",
        },
        documento: {
          tipo_documento: {
            error: false,
            message: "",
          },
          numero: {
            error: false,
            message: "",
          },
          data_emissao: {
            error: false,
            message: "",
          },
        },
        contato: {
          tipo_contato: {
            error: false,
            message: "",
          },
          contato: {
            error: false,
            message: "",
          },
        },
        endereco: {
          cep: {
            error: false,
            message: "",
          },
          logradouro: {
            error: false,
            message: "",
          },
          numero: {
            error: false,
            message: "",
          },
          bairro: {
            error: false,
            message: "",
          },
          cidade_id: {
            error: false,
            message: "",
          },
        },
      },
      estados: [],
      cidades: [],
    };
  }

  componentDidMount() {
    moment.updateLocale("pt-br", trLocale);
    this.loadEstados();
    const { id } = this.props.match.params;
    if (id) {
      this.loadEntidade(id);
    }
  }
  loadEntidade = async (id) => {
    try {
      const response = await api.get(
        `${endpoints.cadastros.configuracoes.entidades.editar}/${id}`
      );
      this.setState({
        nome: response.data.nome,
        token_integracao: response.data.token_integracao,
        codigotce: response.data.codigotce,
        cnpj: response.data.cnpj,
        ativo: response.data.ativo,
        previewLogo: response.data.logo
          ? `${api.defaults.baseURL}${endpoints.file}/${response.data.logo}`
          : "",
        documentos: response.data.documentos,
        enderecos: response.data.enderecos,
        contatos: response.data.contatos,
      });
    } catch (err) {
      NotifyError(
        "Houve um problema ao carregar os dados, por gentileza tente novamente mais tarde."
      );
    }
  };

  loadEstados = async () => {
    try {
      const response = await api.get(endpoints.estados);
      this.setState({ estados: response.data.estados });
    } catch (err) {
      NotifyError("Erro ao carregar os estados!");
    }
  };

  loadCidades = async (estado_id) => {
    if (!estado_id) {
      this.setState({ cidades: [] });
    } else {
      try {
        const response = await api.get(endpoints.cidades, {
          params: {
            uf_id: estado_id,
          },
        });
        this.setState({ cidades: response.data.cidades });
      } catch (err) {
        NotifyError("Erro ao carregar as cidades!");
      }
    }
  };

  handleLogo = (e) => {
    e.preventDefault();
    this.setState({
      previewLogo: URL.createObjectURL(e.target.files[0]),
      logo: e.target.files[0],
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.clearDocumentosErrors();
    this.clearEnderecosErrors();
    this.clearContatosErrors();
    const { id } = this.props.match.params;
    const {
      nome,
      token_integracao,
      codigotce,
      cnpj,
      ativo,
      logo,
      documentos,
      enderecos,
      contatos,
    } = this.state;
    if (this.validate() && enderecos.length > 0 && contatos.length > 0) {
      try {
        const header = {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        };
        const formData = new FormData();
        formData.append("logo", logo);
        formData.append("nome", nome);
        formData.append("token_integracao", token_integracao);
        formData.append("codigotce", codigotce);
        formData.append("cnpj", cnpj);
        formData.append("ativo", ativo);
        formData.append("documentos", JSON.stringify(documentos));
        formData.append("enderecos", JSON.stringify(enderecos));
        formData.append("contatos", JSON.stringify(contatos));
        await api.postOrPut(
          endpoints.cadastros.configuracoes.entidades.criar,
          id,
          formData,
          header
        );
        this.props.history.push("/app/cadastros/configs/entidades/1");
      } catch (err) {
        NotifyError(
          "Ocorreu um erro ao salvar a Entidade! Por favor contate o administrador"
        );
      }
    } else if (this.validate() && enderecos.length === 0) {
      NotifyWarn("Cadastre no mínimo um endereço para salvar!");
    } else if (this.validate() && contatos.length === 0) {
      NotifyWarn("Cadastre no mínimo um contato para salvar!");
    }
  };

  validate = (inputName) => {
    const { errors, nome, cnpj } = this.state;

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

    if ((inputName && inputName === "cnpj" && !cnpj) || (!inputName && !cnpj)) {
      errors.cnpj.error = true;
      errors.cnpj.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "cnpj" && cnpj) ||
      (!inputName && cnpj)
    ) {
      errors.cnpj.error = false;
      errors.cnpj.message = "";
    }

    this.setState({ errors });

    return validate;
  };

  adicionaDocumento = (e) => {
    e.preventDefault();
    const { documento, documentos } = this.state;

    if (this.validateDocumentos()) {
      documentos.push(documento);
      this.setState({
        documento: {
          data_emissao: null,
          numero: null,
          orgao_emissor: null,
          tipo_documento: null,
          cartorio_id: null,
          uf_emissor_id: null,
        },
        documentos,
      });
    }
  };

  removeDocumento = (e, index) => {
    e.preventDefault();
    const { documentos } = this.state;
    documentos.splice(index, 1);
    this.setState({ documentos });
  };

  validateDocumentos = (inputName) => {
    const { errors, documento } = this.state;

    let validate = true;

    if (
      (inputName &&
        inputName === "tipo_documento" &&
        !documento.tipo_documento) ||
      (!inputName && !documento.tipo_documento)
    ) {
      errors.documento.tipo_documento.error = true;
      errors.documento.tipo_documento.message = "Selecione este campo!";
      validate = false;
    } else if (
      (inputName &&
        inputName === "tipo_documento" &&
        documento.tipo_documento) ||
      (!inputName && documento.tipo_documento)
    ) {
      errors.documento.tipo_documento.error = false;
      errors.documento.tipo_documento.message = "";
    }

    if (
      (inputName && inputName === "numero" && !documento.numero) ||
      (!inputName && !documento.numero)
    ) {
      errors.documento.numero.error = true;
      errors.documento.numero.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "numero" && documento.numero) ||
      (!inputName && documento.numero)
    ) {
      errors.documento.numero.error = false;
      errors.documento.numero.message = "";
    }

    if (
      (inputName &&
        inputName === "data_emissao" &&
        documento.data_emissao &&
        !moment(documento.data_emissao, "DD/MM/YYYY", true).isValid()) ||
      (!inputName &&
        documento.data_emissao &&
        !moment(documento.data_emissao, "DD/MM/YYYY", true).isValid())
    ) {
      errors.documento.data_emissao.error = true;
      errors.documento.data_emissao.message = "Preencha com uma data valida!";
      validate = false;
    } else if (
      (inputName &&
        inputName === "data_emissao" &&
        documento.data_emissao &&
        moment(documento.data_emissao, "DD/MM/YYYY", true).isValid()) ||
      (!inputName &&
        documento.data_emissao &&
        moment(documento.data_emissao, "DD/MM/YYYY", true).isValid())
    ) {
      errors.documento.data_emissao.error = false;
      errors.documento.data_emissao.message = "";
    }

    this.setState({ errors });

    return validate;
  };

  clearDocumentosErrors = () => {
    const { errors } = this.state;

    errors.documento.tipo_documento.error = false;
    errors.documento.tipo_documento.message = "";
    errors.documento.numero.error = false;
    errors.documento.numero.message = "";

    this.setState({ errors });
  };

  adicionaEndereco = (e) => {
    e.preventDefault();
    const { endereco, enderecos } = this.state;
    const uf_id = this.uf_id.current;
    const cidade_id = this.cidade_id.current;
    endereco.estado = uf_id[uf_id.selectedIndex].text;
    endereco.cidade = cidade_id[cidade_id.selectedIndex].text;
    if (this.validateEnderecos()) {
      enderecos.push(endereco);
      this.setState({
        endereco: {
          cep: null,
          logradouro: null,
          numero: null,
          complemento: null,
          bairro: null,
          cidade_id: null,
        },
        enderecos,
      });
      uf_id.selectedIndex = "0";
      this.loadCidades();
    }
  };

  removeEndereco = (e, index) => {
    e.preventDefault();
    const { enderecos } = this.state;
    enderecos.splice(index, 1);
    this.setState({ enderecos });
  };

  validateEnderecos = (inputName) => {
    const { errors, endereco } = this.state;

    let validate = true;

    if (
      (inputName && inputName === "cep" && !endereco.cep) ||
      (!inputName && !endereco.cep)
    ) {
      errors.endereco.cep.error = true;
      errors.endereco.cep.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "cep" && endereco.cep) ||
      (!inputName && endereco.cep)
    ) {
      errors.endereco.cep.error = false;
      errors.endereco.cep.message = "";
    }

    if (
      (inputName && inputName === "logradouro" && !endereco.logradouro) ||
      (!inputName && !endereco.logradouro)
    ) {
      errors.endereco.logradouro.error = true;
      errors.endereco.logradouro.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "logradouro" && endereco.logradouro) ||
      (!inputName && endereco.logradouro)
    ) {
      errors.endereco.logradouro.error = false;
      errors.endereco.logradouro.message = "";
    }

    if (
      (inputName && inputName === "numero" && !endereco.numero) ||
      (!inputName && !endereco.numero)
    ) {
      errors.endereco.numero.error = true;
      errors.endereco.numero.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "numero" && endereco.numero) ||
      (!inputName && endereco.numero)
    ) {
      errors.endereco.numero.error = false;
      errors.endereco.numero.message = "";
    }

    if (
      (inputName && inputName === "bairro" && !endereco.bairro) ||
      (!inputName && !endereco.bairro)
    ) {
      errors.endereco.bairro.error = true;
      errors.endereco.bairro.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "bairro" && endereco.bairro) ||
      (!inputName && endereco.bairro)
    ) {
      errors.endereco.bairro.error = false;
      errors.endereco.bairro.message = "";
    }

    if (
      (inputName && inputName === "cidade_id" && !endereco.cidade_id) ||
      (!inputName && !endereco.cidade_id)
    ) {
      errors.endereco.cidade_id.error = true;
      errors.endereco.cidade_id.message = "Selecione este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "cidade_id" && endereco.cidade_id) ||
      (!inputName && endereco.cidade_id)
    ) {
      errors.endereco.cidade_id.error = false;
      errors.endereco.cidade_id.message = "";
    }

    this.setState({ errors });

    return validate;
  };

  consultaCep = async (cep) => {
    try {
      const response = await api.get(endpoints.consultaCep, {
        params: {
          cep: cep,
        },
      });
      let uf = this.state.estados.find(
        (item) => item.sigla === response.data.estado
      );
      await this.loadCidades(uf.id);
      let cidade = this.state.cidades.find(
        (item) => item.nome === response.data.cidade
      );
      console.log(cidade);
      this.setState({
        endereco: {
          cep: response.data.cep,
          logradouro: response.data.logradouro,
          bairro: response.data.bairro,
          cidade_id: cidade.id,
          uf_id: uf.id,
        },
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 432) {
        NotifyWarn(
          "O serviço de consulta de CEP está indisponível no momento, é possível dar sequência com o cadastro manualmente"
        );
      }
    }
  };

  clearEnderecosErrors = () => {
    const { errors } = this.state;

    errors.endereco.cep.error = false;
    errors.endereco.cep.message = "";
    errors.endereco.logradouro.error = false;
    errors.endereco.logradouro.message = "";
    errors.endereco.numero.error = false;
    errors.endereco.numero.message = "";
    errors.endereco.bairro.error = false;
    errors.endereco.bairro.message = "";
    errors.endereco.cidade_id.error = false;
    errors.endereco.cidade_id.message = "";

    this.setState({ errors });
  };

  adicionaContato = (e) => {
    e.preventDefault();
    const { contato, contatos } = this.state;
    if (this.validateContatos()) {
      contatos.push(contato);
      this.setState({
        contato: {
          tipo_contato: null,
          contato: null,
        },
        contatos,
      });
    }
  };

  removeContato = (e, index) => {
    e.preventDefault();
    const { contatos } = this.state;
    contatos.splice(index, 1);
    this.setState({ contatos });
  };

  IsEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  validateContatos = (inputName) => {
    const { errors, contato } = this.state;

    let validate = true;

    if (
      (inputName && inputName === "tipo_contato" && !contato.tipo_contato) ||
      (!inputName && !contato.tipo_contato)
    ) {
      errors.contato.tipo_contato.error = true;
      errors.contato.tipo_contato.message = "Selecione este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "tipo_contato" && contato.tipo_contato) ||
      (!inputName && contato.tipo_contato)
    ) {
      errors.contato.tipo_contato.error = false;
      errors.contato.tipo_contato.message = "";
    }

    if (
      (inputName && inputName === "contato" && !contato.contato) ||
      (!inputName && !contato.contato)
    ) {
      errors.contato.contato.error = true;
      errors.contato.contato.message = "Preencha este campo!";
      validate = false;
    } else if (
      (inputName && inputName === "contato" && contato.contato) ||
      (!inputName && contato.contato)
    ) {
      errors.contato.contato.error = false;
      errors.contato.contato.message = "";
    }

    if (
      inputName &&
      inputName === "contato" &&
      contato.tipo_contato === "3" &&
      !this.IsEmail(contato.contato)
    ) {
      errors.contato.contato.error = true;
      errors.contato.contato.message = "Email inválido";
      validate = false;
    }

    this.setState({ errors });

    return validate;
  };

  clearContatosErrors = () => {
    const { errors } = this.state;

    errors.contato.tipo_contato.error = false;
    errors.contato.tipo_contato.message = "";
    errors.contato.contato.error = false;
    errors.contato.contato.message = "";

    this.setState({ errors });
  };

  handleCodigoTCE = (e) => {
    var keycode = e.target.value.charCodeAt(e.target.value.length - 1);
    //comparing pressed keycodes
    if (keycode > 31 && (keycode < 48 || keycode > 57)) {
      return false;
    } else {
      this.setState({ codigotce: e.target.value });
    }
  };

  render() {
    const {
      id,
      nome,
      token_integracao,
      codigotce,
      cnpj,
      ativo,
      previewLogo,
      documentos,
      documento,
      contatos,
      contato,
      enderecos,
      endereco,
      estados,
      cidades,
      errors,
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
            <h1>Cadastrar entidade</h1>
            <button type="submit">Salvar</button>
          </Header>
          <hr />
          <GroupRow>
            <GroupColumn>
              <InputGroup>
                <label htmlFor="nome">Nome da entidade</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  onBlur={() => {
                    this.validate("nome");
                  }}
                  onChange={(e) => this.setState({ nome: e.target.value })}
                  className={errors.nome.error ? "error" : ""}
                  value={nome || ""}
                />
                {errors.nome.error && (
                  <div className="error-message">{errors.nome.message}</div>
                )}
              </InputGroup>
              <InputGroup>
                <label htmlFor="codigotce">Código no TCE</label>
                <input
                  type="text"
                  id="codigotce"
                  name="codigotce"
                  maxLength="9"
                  onChange={(e) => this.handleCodigoTCE(e)}
                  value={codigotce || ""}
                />
              </InputGroup>
              <InputGroup>
                <label htmlFor="cnpj">CNPJ</label>
                <InputMask
                  mask="99.999.999/9999-99"
                  maskChar={null}
                  type="text"
                  id="cnpj"
                  name="cnpj"
                  onBlur={() => {
                    this.validate("cnpj");
                  }}
                  onChange={(e) => this.setState({ cnpj: e.target.value })}
                  className={errors.cnpj.error ? "error" : ""}
                  value={cnpj || ""}
                />
                {errors.cnpj.error && (
                  <div className="error-message">{errors.cnpj.message}</div>
                )}
              </InputGroup>
              <InputGroup>
                <label htmlFor="token_integracao">
                  Token de integração<i>(Opcional)</i>
                </label>
                <InputMask
                  type="text"
                  id="token_integracao"
                  name="token_integracao"
                  onChange={(e) =>
                    this.setState({ token_integracao: e.target.value })
                  }
                  value={token_integracao || ""}
                />
              </InputGroup>
              <CheckBoxGroup>
                <input
                  type="checkbox"
                  id="ativo"
                  name="ativo"
                  onChange={(e) => this.setState({ ativo: !ativo })}
                  checked={ativo || false}
                />
                <label htmlFor="ativo">Ativo</label>
              </CheckBoxGroup>
            </GroupColumn>
            <UploadGroup>
              <input
                type="file"
                id="logo"
                name="logo"
                onChange={this.handleLogo}
              />
              <label htmlFor="logo">
                <span>Adicionar Logo</span>
              </label>
              <img
                src={previewLogo}
                alt="Logo"
                className={previewLogo === "" ? "hide" : ""}
              />
              <FontAwesomeIcon
                icon={faImage}
                className={`faImage ${previewLogo !== "" ? "hide" : ""}`}
              />
            </UploadGroup>
          </GroupRow>
          <br />
          <Tabs>
            <div label="Documentos">
              <GroupRow>
                <GroupColumn className="p-b-20">
                  <GroupRow>
                    <GroupColumn className="p-r-20">
                      <InputGroup>
                        <label htmlFor="tipo_documento">
                          Tipo de documento
                        </label>
                        <select
                          id="tipo_documento"
                          name="tipo_documento"
                          onBlur={() => {
                            this.validateDocumentos("tipo_documento");
                          }}
                          onChange={(e) =>
                            this.setState({
                              documento: {
                                ...documento,
                                tipo_documento: e.target.value,
                              },
                            })
                          }
                          className={
                            errors.documento.tipo_documento.error ? "error" : ""
                          }
                          value={documento.tipo_documento || ""}
                        >
                          <option value="">Selecione</option>
                          {tipoDocumento.map((tipo_documento, index) => (
                            <option key={index} value={index + 1}>
                              {tipo_documento}
                            </option>
                          ))}
                        </select>
                        {errors.documento.tipo_documento.error && (
                          <div className="error-message">
                            {errors.documento.tipo_documento.message}
                          </div>
                        )}
                      </InputGroup>
                      <InputGroup>
                        <label htmlFor="orgao_emissor">
                          Orgão emissor<i>(Opcional)</i>
                        </label>
                        <input
                          type="text"
                          id="orgao_emissor"
                          name="orgao_emissor"
                          onChange={(e) =>
                            this.setState({
                              documento: {
                                ...documento,
                                orgao_emissor: e.target.value,
                              },
                            })
                          }
                          value={documento.orgao_emissor || ""}
                        />
                      </InputGroup>
                    </GroupColumn>
                    <GroupColumn className="p-r-20">
                      <InputGroup>
                        <label htmlFor="numero">Número do documento</label>
                        <input
                          type="text"
                          onBlur={() => {
                            this.validateDocumentos("numero");
                          }}
                          onChange={(e) =>
                            this.setState({
                              documento: {
                                ...documento,
                                numero: e.target.value,
                              },
                            })
                          }
                          className={
                            errors.documento.numero.error ? "error" : ""
                          }
                          value={documento.numero || ""}
                        />
                        {errors.documento.numero.error && (
                          <div className="error-message">
                            {errors.documento.numero.message}
                          </div>
                        )}
                      </InputGroup>
                      <InputGroup>
                        <label htmlFor="data_emissao">
                          Data emissão<i>(Opcional)</i>
                        </label>
                        <Datetime
                          timeFormat={false}
                          closeOnSelect={true}
                          onBlur={(date) => {
                            date instanceof moment
                              ? this.setState({
                                  errors: {
                                    ...errors,
                                    documento: {
                                      ...errors.documento,
                                      data_emissao: {
                                        error: false,
                                        message: "",
                                      },
                                    },
                                  },
                                })
                              : this.validateDocumentos("data_emissao");
                          }}
                          onChange={(date) => {
                            this.setState({
                              documento: {
                                ...documento,
                                data_emissao:
                                  date instanceof moment
                                    ? date.format("DD/MM/YYYY")
                                    : date,
                              },
                            });
                          }}
                          inputProps={{
                            autoComplete: "off",
                            id: "data_emissao",
                            name: "data_emissao",
                            mask: "99/99/9999",
                            maskChar: null,
                            className: errors.documento.data_emissao.error
                              ? "error"
                              : "",
                          }}
                          renderInput={(props) => <InputMask {...props} />}
                          value={documento.data_emissao || ""}
                        />
                        {errors.documento.data_emissao.error && (
                          <div className="error-message">
                            {errors.documento.data_emissao.message}
                          </div>
                        )}
                      </InputGroup>
                      <InputGroup>
                        <label htmlFor="uf_emissor_id">
                          Estado emissor<i>(Opcional)</i>
                        </label>
                        <select
                          id="uf_emissor_id"
                          name="uf_emissor_id"
                          onChange={(e) =>
                            this.setState({
                              documento: {
                                ...documento,
                                uf_emissor_id: e.target.value,
                              },
                            })
                          }
                          value={documento.uf_emissor_id || ""}
                        >
                          <option value="">Selecione</option>
                          {estados.map((estado) => (
                            <option key={estado.id} value={estado.id}>
                              {estado.nome}
                            </option>
                          ))}
                        </select>
                      </InputGroup>
                    </GroupColumn>
                  </GroupRow>
                  <button type="button" onClick={this.adicionaDocumento}>
                    <FontAwesomeIcon icon={faPlus} className="plus" />
                    Adicionar
                  </button>
                </GroupColumn>
                <GroupColumn>
                  <Table>
                    <thead>
                      <tr>
                        <th>Tipo de documento</th>
                        <th>Nº do documento</th>
                        <th className="actions" />
                      </tr>
                    </thead>
                    <tbody>
                      {documentos.map((documento, index) => (
                        <tr key={index}>
                          <td>
                            {Object.keys(tipoDocumento)
                              .filter(
                                (key) =>
                                  parseInt(key) + 1 ===
                                  parseInt(documento.tipo_documento)
                              )
                              .map((key) => tipoDocumento[key])}
                          </td>
                          <td>{documento.numero}</td>
                          <td>
                            <button
                              type="button"
                              className="delete"
                              onClick={(e) => this.removeDocumento(e, index)}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {documentos.length === 0 && (
                        <tr>
                          <td colSpan="3" align="center">
                            Nenhum registro localizado no sistema.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </GroupColumn>
              </GroupRow>
            </div>
            <div label="Endereços">
              <GroupRow>
                <GroupColumn className="p-r-20 p-b-20">
                  <InputGroup>
                    <label htmlFor="cep">CEP</label>
                    <InputMask
                      mask="99.999-999"
                      maskChar={null}
                      type="text"
                      id="cep"
                      name="cep"
                      onBlur={() => {
                        this.consultaCep(endereco.cep);
                        this.validateEnderecos("cep");
                      }}
                      onChange={(e) =>
                        this.setState({
                          endereco: {
                            ...endereco,
                            cep: e.target.value,
                          },
                        })
                      }
                      className={errors.endereco.cep.error ? "error" : ""}
                      value={endereco.cep || ""}
                    />
                    {errors.endereco.cep.error && (
                      <div className="error-message">
                        {errors.endereco.cep.message}
                      </div>
                    )}
                  </InputGroup>
                  <InputGroup>
                    <label htmlFor="logradouro">Logradouro</label>
                    <input
                      type="text"
                      id="logradouro"
                      name="logradouro"
                      onBlur={() => {
                        this.validateEnderecos("logradouro");
                      }}
                      onChange={(e) =>
                        this.setState({
                          endereco: {
                            ...endereco,
                            logradouro: e.target.value,
                          },
                        })
                      }
                      className={
                        errors.endereco.logradouro.error ? "error" : ""
                      }
                      value={endereco.logradouro || ""}
                    />
                    {errors.endereco.logradouro.error && (
                      <div className="error-message">
                        {errors.endereco.logradouro.message}
                      </div>
                    )}
                  </InputGroup>
                  <GroupRow>
                    <GroupColumn className="p-r-20">
                      <InputGroup>
                        <label htmlFor="numero">Número</label>
                        <input
                          type="text"
                          id="numero"
                          name="numero"
                          onBlur={() => {
                            this.validateEnderecos("numero");
                          }}
                          onChange={(e) =>
                            this.setState({
                              endereco: {
                                ...endereco,
                                numero: e.target.value,
                              },
                            })
                          }
                          className={
                            errors.endereco.numero.error ? "error" : ""
                          }
                          value={endereco.numero || ""}
                        />
                        {errors.endereco.numero.error && (
                          <div className="error-message">
                            {errors.endereco.numero.message}
                          </div>
                        )}
                      </InputGroup>
                    </GroupColumn>
                    <GroupColumn>
                      <InputGroup>
                        <label htmlFor="complemento">
                          Complemento<i>(Opcional)</i>
                        </label>
                        <input
                          type="text"
                          id="complemento"
                          name="complemento"
                          onChange={(e) =>
                            this.setState({
                              endereco: {
                                ...endereco,
                                complemento: e.target.value,
                              },
                            })
                          }
                          value={endereco.complemento || ""}
                        />
                      </InputGroup>
                    </GroupColumn>
                  </GroupRow>
                  <InputGroup>
                    <label htmlFor="bairro">Bairro</label>
                    <input
                      type="text"
                      id="bairro"
                      name="bairro"
                      onBlur={() => {
                        this.validateEnderecos("bairro");
                      }}
                      onChange={(e) =>
                        this.setState({
                          endereco: {
                            ...endereco,
                            bairro: e.target.value,
                          },
                        })
                      }
                      className={errors.endereco.bairro.error ? "error" : ""}
                      value={endereco.bairro || ""}
                    />
                    {errors.endereco.bairro.error && (
                      <div className="error-message">
                        {errors.endereco.bairro.message}
                      </div>
                    )}
                  </InputGroup>
                  <InputGroup>
                    <label htmlFor="uf_id">Estado</label>
                    <select
                      id="uf_id"
                      name="uf_id"
                      ref={this.uf_id}
                      onChange={(e) => this.loadCidades(e.target.value)}
                      value={endereco.uf_id}
                    >
                      <option value="">Selecione</option>
                      {estados.map((estado) => (
                        <option key={estado.id} value={estado.id}>
                          {estado.nome}
                        </option>
                      ))}
                    </select>
                  </InputGroup>
                  <InputGroup>
                    <label htmlFor="cidade_id">Cidade</label>
                    <select
                      id="cidade_id"
                      name="cidade_id"
                      ref={this.cidade_id}
                      onChange={(e) =>
                        this.setState({
                          endereco: {
                            ...endereco,
                            cidade_id: e.target.value,
                          },
                        })
                      }
                      className={errors.endereco.cidade_id.error ? "error" : ""}
                      value={endereco.cidade_id || ""}
                    >
                      <option value="">Selecione</option>
                      {cidades.map((cidade) => (
                        <option key={cidade.id} value={cidade.id}>
                          {cidade.nome}
                        </option>
                      ))}
                    </select>
                    {errors.endereco.cidade_id.error && (
                      <div className="error-message">
                        {errors.endereco.cidade_id.message}
                      </div>
                    )}
                  </InputGroup>
                  <button type="button" onClick={this.adicionaEndereco}>
                    <FontAwesomeIcon icon={faPlus} className="plus" />
                    Adicionar
                  </button>
                </GroupColumn>
                <GroupColumn>
                  <Table>
                    <thead>
                      <tr>
                        <th>Endereços</th>
                        <th className="actions" />
                      </tr>
                    </thead>
                    <tbody>
                      {enderecos.map((endereco, index) => (
                        <tr key={index}>
                          <td>
                            {`${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro} - ${endereco.cidade}, ${endereco.estado}`}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="delete"
                              onClick={(e) => this.removeEndereco(e, index)}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {enderecos.length === 0 && (
                        <tr>
                          <td colSpan="3" align="center">
                            Nenhum registro localizado no sistema.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </GroupColumn>
              </GroupRow>
            </div>
            <div label="Contatos">
              <GroupRow>
                <GroupColumn className="p-r-20 p-b-20">
                  <InputGroup>
                    <label htmlFor="tipo_contato">Forma de contato</label>
                    <select
                      id="tipo_contato"
                      name="tipo_contato"
                      onBlur={() => {
                        this.validateContatos("tipo_contato");
                      }}
                      onChange={(e) =>
                        this.setState({
                          contato: {
                            ...contato,
                            tipo_contato: e.target.value,
                          },
                        })
                      }
                      className={
                        errors.contato.tipo_contato.error ? "error" : ""
                      }
                      value={contato.tipo_contato || ""}
                    >
                      <option value="">Selecione</option>
                      {tipoContato.map((tipo_contato, index) => (
                        <option key={index} value={index + 1}>
                          {tipo_contato}
                        </option>
                      ))}
                    </select>
                    {errors.contato.tipo_contato.error && (
                      <div className="error-message">
                        {errors.contato.tipo_contato.message}
                      </div>
                    )}
                  </InputGroup>
                  <InputGroup>
                    <label htmlFor="contato">Contato</label>
                    <InputMask
                      mask={
                        this.state.contato.tipo_contato === "1"
                          ? "(99) 9999-9999"
                          : this.state.contato.tipo_contato === "2"
                          ? "(99) 9 9999-9999"
                          : this.state.contato.tipo_contato === "4"
                          ? "(99) 9999-9999"
                          : ""
                      }
                      maskChar={" "}
                      id="contato"
                      name="contato"
                      onBlur={() => {
                        this.validateContatos("contato");
                      }}
                      onChange={(e) =>
                        this.setState({
                          contato: {
                            ...contato,
                            contato: e.target.value,
                          },
                        })
                      }
                      className={errors.contato.contato.error ? "error" : ""}
                      value={contato.contato || ""}
                    />
                    {errors.contato.contato.error && (
                      <div className="error-message">
                        {errors.contato.contato.message}
                      </div>
                    )}
                  </InputGroup>
                  <button type="button" onClick={this.adicionaContato}>
                    <FontAwesomeIcon icon={faPlus} className="plus" />
                    Adicionar
                  </button>
                </GroupColumn>
                <GroupColumn>
                  <Table>
                    <thead>
                      <tr>
                        <th>Forma de Contato</th>
                        <th>Contato</th>
                        <th className="actions" />
                      </tr>
                    </thead>
                    <tbody>
                      {contatos.map((contato, index) => (
                        <tr key={index}>
                          <td>
                            {Object.keys(tipoContato)
                              .filter(
                                (key) =>
                                  parseInt(key) + 1 ===
                                  parseInt(contato.tipo_contato)
                              )
                              .map((key) => tipoContato[key])}
                          </td>
                          <td>{contato.contato}</td>
                          <td>
                            <button
                              type="button"
                              className="delete"
                              onClick={(e) => this.removeContato(e, index)}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {contatos.length === 0 && (
                        <tr>
                          <td colSpan="3" align="center">
                            Nenhum registro localizado no sistema.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </GroupColumn>
              </GroupRow>
            </div>
          </Tabs>
        </Form>
      </Container>
    );
  }
}
