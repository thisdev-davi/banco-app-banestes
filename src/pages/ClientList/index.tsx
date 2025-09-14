import {useEffect, useState} from "react";
import type { Cliente } from "../../types";
import { buscarClientes } from "../../services/serviceData" ;

export function ClientListPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarClientes = async() => {
      try{
        const clientesData = await buscarClientes();
        setClientes(clientesData);
      } catch (err){
        setError("Falha ao carregar a lista de clientes!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarClientes();
  },[]);

  if(loading) {
    return <h1>Lista sendo carreegada...</h1>
  }

  if(error){
    return <h1>{error}</h1>
  }

  return (
    <div>
        <h1>Lista de Clientes</h1>
        <ul>
            {clientes.map(cliente => (
                <li key={cliente.id}>
                    <strong>{cliente.nome}</strong> - CPF/CNPJ: {cliente.cpfCnpj}
                </li>
        ))}
        </ul>
    </div>
  );
}