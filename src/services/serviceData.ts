import Papa from "papaparse";
import type { Cliente, Conta, Agencia } from "../types";


const URL_CLIENTES = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes";
const URL_CONTAS = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas";
const URL_AGENCIAS = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias";

export const buscarClientes = async(): Promise<Cliente[]> => {
    const response = await fetch(URL_CLIENTES);
    const textCsv = await response.text();
    const parsedData = Papa.parse(textCsv, {
        header: true, // primeira linha é cabecalho
        dynamicTyping: true, // tenta adivinhar o tipo do dado
        skipEmptyLines: true,
    })
    console.log("Debug Papaparse [CLIENTES]:", parsedData);

    const clientes: Cliente[] = parsedData.data.map((item:any) => ({
        id: item.id.toString(),
        cpfCnpj: item.cpfCnpj,
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
    return clientes;
};

export const buscarContas = async(): Promise<Conta[]> => {
    const response = await fetch(URL_CONTAS);
    const textCsv = await response.text();
    const parsedData = Papa.parse(textCsv, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
    });
    console.log("Debug Papaparse [CONTAS]:", parsedData);

    const contas: Conta[] = parsedData.data.map((item:any) => ({
        id: item.id.toString(),
        cpfCnpjCliente: item.cpfCnpjCliente,
        tipo: item.tipo,
        saldo: item.saldo,
        limiteCredito: item.limiteCredito,
        creditoDisponivel: item.creditoDisponivel,
    }));
    return contas;
};

export const buscarAgencias = async(): Promise<Agencia[]> => {
    const response = await fetch(URL_AGENCIAS);
    const textCsv = await response.text();
    const parsedData = Papa.parse(textCsv, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
    });
    console.log("Debug Papaparse [AGENCIAS]:", parsedData);

    const agencias: Agencia[] = parsedData.data.map((item:any) => ({
        id: item.id.toString(),
        codigo: item.codigo,
        nome: item.nome,
        endereco: item.endereco,
    }));
    return agencias;
};