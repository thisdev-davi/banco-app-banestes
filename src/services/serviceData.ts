import Papa from "papaparse";
import type { Cliente, Conta, Agencia } from "../types";

const URL_CLIENTES = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS10p7Znt-90ER9PhFZnWnQjdmvtpFfRuihaMFNh5z7etOkZYWjyU-Y1ssy60CYgqo_CM_cgbgLudhT/pub?output=csv";
const URL_CONTAS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRD4s_RS9vGlUKk-OC36WXVjfV-VDxVDq09WFSnyT5CcREh8ycQluWCQevMWYARjXkunyuV9R7Ud1MR/pub?output=csv";
const URL_AGENCIAS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTf7giuP_zkBwEzZJmakHKTSe2k2cOt4_a_g2wWAeGRUtsCnHIyzWsXxSVz2ekuyi5QLNcCPNuPQnWd/pub?output=csv";

async function obterDados<T>(url: string, transformar: (item: any) => T): Promise<T[]> {
  const resposta = await fetch(url);
  const textoCsv = await resposta.text();
  const dadosParseados = Papa.parse(textoCsv, {
    header: true,
    skipEmptyLines: true,
  });

  const dadosValidos = dadosParseados.data.filter((item: any) => item && item.id);
  return dadosValidos.map(transformar);
}

export const buscarClientes = async (): Promise<Cliente[]> => {
  return obterDados(URL_CLIENTES, (item) => ({
    id: item.id,
    cpfCnpj: item.cpfCnpj,
    rg: item.rg || "Não informado",
    dataNascimento: new Date(item.dataNascimento),
    nome: item.nome,
    nomeSocial: item.nomeSocial,
    email: item.email,
    endereco: item.endereco,
    rendaAnual: Number(item.rendaAnual) || 0,
    patrimonio: Number(item.patrimonio) || 0,
    estadoCivil: item.estadoCivil,
    codigoAgencia: Number(item.codigoAgencia) || 0
  }));
};

export const buscarContas = async (): Promise<Conta[]> => {
  return obterDados(URL_CONTAS, (item) => ({
    id: String(item.id),
    cpfCnpjCliente: String(item.cpfCnpjCliente),
    tipo: item.tipo,
    saldo: Number(item.saldo) || 0,
    limiteCredito: Number(item.limiteCredito) || 0,
    creditoDisponivel: Number(item.creditoDisponivel) || 0,
  }));
};

export const buscarAgencias = async (): Promise<Agencia[]> => {
  return obterDados(URL_AGENCIAS, (item) => ({
    id: String(item.id),
    codigo: Number(item.codigo) || 0,
    nome: item.nome,
    endereco: item.endereco,
  }));
};