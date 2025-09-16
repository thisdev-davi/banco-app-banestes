import Papa from "papaparse";
import type { Cliente, Conta, Agencia } from "../types";


const URL_CLIENTES = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes";
const URL_CONTAS = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas";
const URL_AGENCIAS = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias";

async function  buscarDados<T>(url: string, transformador: (item:any)=> T): Promise<T[]> {
    const response = await fetch(url);
    const textCsv = await response.text();
    const parsedData = Papa.parse(textCsv, {
        header: true, // primeira linha é cabecalho
        skipEmptyLines: true,
    });

    const dadosLimpos = parsedData.data.filter((item: any) => item && item.id).map(transformador);
    return dadosLimpos;
}

export const buscarClientes = async(): Promise<Cliente[]> => {
    return buscarDados(URL_CLIENTES, (item) => ({
        id: item.id,
        cpfCnpj: item.cpfCnpj,
        rg: item.rg,
        dataNascimento: new Date(item.dataNascimento), // converter par aum objeto do tipo date
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

export const buscarContas = async(): Promise<Conta[]> => {
    return buscarDados(URL_CONTAS, (item) => ({
        id: String(item.id),
        cpfCnpjCliente: String(item.cpfCnpjCliente),
        tipo: item.tipo,
        saldo: Number(item.saldo) || 0,
        limiteCredito: Number(item.limiteCredito) || 0,
        creditoDisponivel: Number(item.creditoDisponivel) || 0,
    }))
};

export const buscarAgencias = async(): Promise<Agencia[]> => {
    return buscarDados(URL_AGENCIAS, (item) => ({
        id: String(item.id),
        codigo: Number(item.codigo),
        nome: item.nome,
        endereco: item.endereco,
    }));
};