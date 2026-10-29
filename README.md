# Banco App Banestes
Este projeto foi desenvolvido como teste técnico para uma vaga de estágio de desenvolvedor no Banestes. O desafio era construir um sistema com Vite e Fetch API para consumir dados, com foco em uma interface funcional e responsiva.

A aplicação lista os clientes do banco com busca por nome ou CPF/CNPJ, e mostra o detalhe de cada um com suas contas e agência. Os dados vêm de planilhas do Google Sheets publicadas em CSV e lidas com PapaParse. Feito com React 19, TypeScript e React Router.

## Pré-requisitos
* Node.js 18+
* npm

## Execução
```bash
git clone https://github.com/thisdev-davi/banco-app-banestes.git
cd banco-app-banestes
npm install
npm run dev
```

O deploy vai para o GitHub Pages com `npm run build && npm run deploy`.
