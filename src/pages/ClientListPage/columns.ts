export const COLUNAS = [
  { chave: "cpfCnpj", rotulo: "CPF/CNPJ" },
  { chave: "email", rotulo: "E-mail" },
  { chave: "rg", rotulo: "RG" },
  { chave: "dataNascimento", rotulo: "Data Nasc." },
  { chave: "rendaAnual", rotulo: "Renda Anual" },
  { chave: "patrimonio", rotulo: "Patrimônio" },
  { chave: "estadoCivil", rotulo: "Estado Civil" },
  { chave: "codigoAgencia", rotulo: "Código Agência" },
] as const;

export type ChaveColuna = typeof COLUNAS[number]["chave"];