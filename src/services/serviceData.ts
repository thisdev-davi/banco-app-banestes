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
        dynamicTyping: true, // tenta adivinhar o tipo do dado
        skipEmptyLines: true,
    });

    const dadosLimpos = parsedData.data.filter((item: any): 
    item is Record<string, any> => item && item.id).map(transformador);

    return dadosLimpos;
}

export const buscarClientes = async(): Promise<Cliente[]> => {
    return buscarDados(URL_CLIENTES, (item) => ({
        id: String(item.id),
        cpfCnpj: String(item.cpfCnpj),
        rg: item.rg,
        dataNascimento: new Date(item.dataNascimento), // converter par aum objeto do tipo date
        nome: item.nome,
        nomeSocial: item.nomeSocial,
        email: item.email,
        endereco: item.endereco,
        rendaAnual: item.rendaAnual,
        patrimonio: item.patrimonio,
        estadoCivil: item.estadoCivil,
        codigoAgencia: item.codigoAgencia
    }));
};

export const buscarContas = async(): Promise<Conta[]> => {
    return buscarDados(URL_CONTAS, (item) => ({
        id: String(item.id),
        cpfCnpjCliente: String(item.cpfCnpjCliente),
        tipo: item.tipo,
        saldo: item.saldo,
        limiteCredito: item.limiteCredito,
        creditoDisponivel: item.creditoDisponivel,
    }))
};

export const buscarAgencias = async(): Promise<Agencia[]> => {
    return buscarDados(URL_AGENCIAS, (item) => ({
        id: String(item.id),
        codigo: item.codigo,
        nome: item.nome,
        endereco: item.endereco,
    }));
};