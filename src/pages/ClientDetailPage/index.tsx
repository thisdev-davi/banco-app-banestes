import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Cliente, Conta, Agencia } from "../../types";
import { buscarClientes, buscarContas, buscarAgencias } from "../../services/serviceData";
import styles from "./ClientDetailPage.module.css";
import iconeUsuario from '../../assets/user.svg';

export function ClientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [contas, setContas] = useState<Conta[]>([]);
    const [agencia, setAgencia] = useState<Agencia | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        const carregarDadosDetalhados = async () => {
            if (!id) return;
            try {
                const [dadosClientes, dadosContas, dadosAgencias] = await Promise.all([
                   buscarClientes(),
                   buscarContas(),
                   buscarAgencias()
                ]);

                const clienteEncontrado = dadosClientes.find(c => c.id === id);
                if (!clienteEncontrado) throw new Error("Cliente não encontrado!");

                const contasDoCliente = dadosContas.filter(c => c.cpfCnpjCliente === clienteEncontrado.cpfCnpj);
                const agenciaDoCliente = dadosAgencias.find(a => a.codigo === clienteEncontrado.codigoAgencia);

                setCliente(clienteEncontrado);
                setContas(contasDoCliente);
                setAgencia(agenciaDoCliente || null);
            } catch (err) {
                setErro("Falha ao carregar os detalhes do cliente.");
                console.error(err);
            } finally {
                setCarregando(false);
            }
        };
        carregarDadosDetalhados();
    }, [id]);

    if (carregando) return <h1>Carregando detalhes do cliente...</h1>;
    if (erro) return <h1>{erro}</h1>;
    if (!cliente) return <h1>Cliente não encontrado.</h1>;

    return (
        <div className={styles.containerPagina}>
            <header className={styles.cabecalho}>
                <div className={styles.identificadorCliente}>
                    <img src={iconeUsuario} alt="Ícone do cliente" className={styles.iconeUsuario} />
                    <h1 className={styles.nomeCliente}>{cliente.nome}</h1>
                </div>

                {agencia && (
                    <div className={styles.infoAgencia}>
                        {agencia.nome.toUpperCase()}
                    </div>
                )}
                
                {agencia && (
                    <div className={styles.infoAgencia}>
                        CÓDIGO: {agencia.codigo}
                    </div>
                )}
            </header>

            <section className={styles.secaoContas}>
                {contas.map((conta, index) => (
                    <div key={conta.id} className={`${styles.cartaoConta} ${index === 0 ? styles.primario : ''}`}>
                        <h2 className={styles.tituloCartao}>{conta.tipo}</h2>
                        <p className={styles.saldoCartao}>R$ {conta.saldo.toFixed(2).replace('.', ',')}</p>
                        <div className={styles.rodapeCartao}>
                            <div>
                                <div className={styles.rodapeCartaoLabel}>Limite de Crédito</div>
                                <div className={styles.rodapeCartaoValor}>R$ {conta.limiteCredito.toFixed(2).replace('.', ',')}</div>
                            </div>
                            <div>
                                <div className={styles.rodapeCartaoLabel}>Crédito Disponível</div>
                                <div className={styles.rodapeCartaoValor}>R$ {conta.creditoDisponivel.toFixed(2).replace('.', ',')}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <section>
                <h2 className={styles.tituloDadosPessoais}>Dados Pessoais:</h2>
                <div className={styles.linhaDado}>
                    <span className={styles.rotuloDado}>CPF/CNPJ</span>
                    <span className={styles.valorDado}>{cliente.cpfCnpj}</span>
                </div>
                <div className={styles.linhaDado}>
                    <span className={styles.rotuloDado}>RG</span>
                    <span className={styles.valorDado}>{cliente.rg}</span>
                </div>
                <div className={styles.linhaDado}>
                    <span className={styles.rotuloDado}>DATA DE NASC.</span>
                    <span className={styles.valorDado}>{cliente.dataNascimento.toLocaleDateString('pt-BR')}</span>
                </div>
                <div className={styles.linhaDado}>
                    <span className={styles.rotuloDado}>EMAIL</span>
                    <span className={styles.valorDado}>{cliente.email}</span>
                </div>
                <div className={styles.linhaDado}>
                    <span className={styles.rotuloDado}>ENDEREÇO</span>
                    <span className={styles.valorDado}>{cliente.endereco}</span>
                </div>
                <div className={styles.linhaDado}>
                    <span className={styles.rotuloDado}>ESTADO CIVIL</span>
                    <span className={styles.valorDado}>{cliente.estadoCivil}</span>
                </div>
                <div className={styles.linhaDado}>
                    <span className={styles.rotuloDado}>RENDA ANUAL</span>
                    <span className={styles.valorDado}>R$ {cliente.rendaAnual.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className={styles.linhaDado}>
                    <span className={styles.rotuloDado}>PATRIMÔNIO</span>
                    <span className={styles.valorDado}>R$ {cliente.patrimonio.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className={styles.linhaDado}>
                    <span className={styles.rotuloDado}>CÓDIGO AGÊNCIA</span>
                    <span className={styles.valorDado}>{cliente.codigoAgencia}</span>
                </div>
            </section>
        </div>
    );
}