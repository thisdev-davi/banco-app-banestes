import { useEffect, useState } from "react";
import * as dataService from "./services/serviceData";
import type { Cliente, Conta, Agencia } from "./types";

function App() {
  // comeca com array vazio, set cliente atualiza
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async() => {
      try{
        // promisse.all espera todas as promises terminarem
        const [clientesData, contasData, agenciasData] = await Promise.all([
          dataService.buscarClientes(),
          dataService.buscarContas(),
          dataService.buscarAgencias(),
        ]);

        setClientes(clientesData);
        setContas(contasData);
        setAgencias(agenciasData);

        console.log("Clientes: ", clientesData);
        console.log("Contas: ", contasData);
        console.log("Agencias: ", agenciasData);
      } catch (err){
        setError("Falha ao carregar os dados! Verifique o console");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  },[]);

  if(loading) {
    return <h1>Dados sendo carregado...</h1>
  }

  if(error){
    return <h1>{error}</h1>
  }

  return (
    <div>
      <h1>Dados Carregados com Sucesso</h1>
      <p><b>{clientes.length}</b> clientes encontrados</p>
      <p><b>{contas.length}</b> contas encontradas</p>
      <p><b>{agencias.length}</b> agencias encontradas</p>
    </div>
  );
}

export default App;