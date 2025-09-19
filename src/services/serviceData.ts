import Papa from "papaparse";
import type { Cliente, Conta, Agencia } from "../types";

const URL_CLIENTES = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes";
const URL_CONTAS = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas";
const URL_AGENCIAS = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias";

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