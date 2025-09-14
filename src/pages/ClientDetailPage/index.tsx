import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Cliente, Conta, Agencia } from "../../types";
import { buscarClientes, buscarContas, buscarAgencias } from "../../services/serviceData";

export function ClientDetailPage(){
    const { id } = useParams<{ id: string }>();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [contas, setContas] = useState<Conta[]>([]);
    const [agencia, setAgencia] = useState<Agencia | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const carregarDadosDetalhados = async() => {
            if (!id) return;

            try{
                const [clientesData, contasData, agenciasData] = await Promise.all([
                   buscarClientes(),
                   buscarContas(),
                   buscarAgencias()
                ]);

                const clienteEncontrado = clientesData.find(cliente => cliente.id === id);
                if (!clienteEncontrado) throw new Error("Cliente não encontrado!");

                const contasDoCliente = contasData.filter(
                    conta => conta.cpfCnpjCliente === clienteEncontrado.cpfCnpj
                );
                const agenciaDoCliente = agenciasData.find(
                    agencia => agencia.codigo === clienteEncontrado.codigoAgencia
                );

                setCliente(clienteEncontrado);
                setContas(contasDoCliente);
                setAgencia(agenciaDoCliente || null);
            } catch (error) {
                setError("Falha ao carregar os detalhes do cliente!");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        carregarDadosDetalhados();
    }, [id]);

    if (loading) return <h1>Carregando detalhes do cliente...</h1>;
    if (error) return <h1>{error}</h1>;
    if (!cliente) return <h1>Cliente não encontrado!</h1>;

    return(
        <div>
            <Link to = "/">&larr; Voltar para a lista!</Link>
            <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                Detalhes de {cliente.nome}
            </h1>

            {/* dados pessoais */}
            <div style={{ marginBottom: '30px' }}>
                <h2>Dados Pessoais</h2>
                <p><strong>Nome Social:</strong> {cliente.nomeSocial || 'N/A'}</p>
                <p><strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}</p>
                <p><strong>RG:</strong> {cliente.rg}</p>
                <p><strong>Email:</strong> {cliente.email}</p>
                <p><strong>Endereço:</strong> {cliente.endereco}</p>
                <p><strong>Data de Nascimento:</strong> {cliente.dataNascimento.toLocaleDateString()}</p>
            </div>

            {/* dados de contas */}
            <div style={{ marginBottom: '30px' }}>
                <h2>Contas</h2>
                {contas.length > 0 ? (
                    contas.map(conta => (
                        <div key={conta.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                            <p><strong>Tipo:</strong> {conta.tipo}</p>
                            <p><strong>Saldo:</strong> R$ {conta.saldo.toFixed(2)}</p>
                            <p><strong>Limite de Crédito:</strong> R$ {conta.limiteCredito.toFixed(2)}</p>
                        </div>
                    ))
                ) : (
                    <p>Nenhuma conta encontrada para este cliente.</p>
                )}
            </div>

            {/* agencia */}
            {agencia && (
                <div>
                    <h2>Agência</h2>
                    <p><strong>Nome da Agência:</strong> {agencia.nome}</p>
                    <p><strong>Código:</strong> {agencia.codigo}</p>
                    <p><strong>Endereço:</strong> {agencia.endereco}</p>
                </div>
            )}
        </div>
    );
}
