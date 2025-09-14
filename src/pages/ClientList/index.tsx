import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import type { Cliente } from "../../types";
import { buscarClientes } from "../../services/serviceData";

const ITENS_POR_PAG = 10;

export function ClientListPage() {
	const [clientes, setClientes] = useState<Cliente[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [busca, setBusca] = useState("");
	const [paginaAtual, setPaginaAtual] = useState(1);

	useEffect(() => {
		const carregarClientes = async () => {
			try {
				const clientesData = await buscarClientes();
				setClientes(clientesData);
			} catch (err) {
				setError("Falha ao carregar a lista de clientes!");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		carregarClientes();
	}, []);

	// correcao de erro ortografico
	const normalizarTexto = (texto: string) =>
		texto.toLowerCase().replace(/[.\-/]/g, "");

	const clientesFiltrados = useMemo(() => {
		const buscaNormalizada = normalizarTexto(busca);
		if (!buscaNormalizada) return clientes;

		return clientes.filter((cliente) => {
			const nomeNormalizado = normalizarTexto(cliente.nome);
			const cpfCnpjNormalizado = normalizarTexto(String(cliente.cpfCnpj));

			return (
				nomeNormalizado.startsWith(buscaNormalizada) ||
				cpfCnpjNormalizado.startsWith(buscaNormalizada)
			);
		});
	}, [clientes, busca]);

	const totalPaginas = Math.ceil(clientesFiltrados.length / ITENS_POR_PAG);
	const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAG;
	const indiceFinal = indiceInicial + ITENS_POR_PAG;
	const clientesDaPagina = clientesFiltrados.slice(indiceInicial, indiceFinal);

	const proxPagina = () => {
		setPaginaAtual((pag) => Math.min(pag + 1, totalPaginas));
	};

	const paginaAnt = () => {
		setPaginaAtual((pag) => Math.max(pag - 1, 1));
	};

	if (loading) return <h1>Lista sendo carreegada...</h1>;
	if (error) return <h1>{error}</h1>;

	return (
		<div>
			{/* input de busca */}
			<input
				type="text"
				placeholder="Buscar por nome ou CPF/CNPJ..."
				value={busca}
				onChange={(e) => {
					setBusca(e.target.value);
					setPaginaAtual(1);
				}}
				style={{ width: "300px", padding: "8px", marginBottom: "20px" }}
			/>

			{/* tabela de clientes */}
			<table style={{ width: "100%", borderCollapse: "collapse" }}>
				<thead>
					<tr style={{ backgroundColor: "#212121" }}>
						<th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>Nome</th>
						<th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>CPF/CNPJ</th>
						<th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>E-mail</th>
					</tr>
				</thead>
				<tbody>
					{clientesDaPagina.map((cliente) => (
						<tr key={cliente.id}>
							<td style={{ padding: "8px", border: "1px solid #ddd" }}>
								<Link to={`/cliente/${cliente.id}`}>{cliente.nome}</Link>
							</td>
							<td style={{ padding: "8px", border: "1px solid #ddd" }}>{cliente.cpfCnpj}</td>
							<td style={{ padding: "8px", border: "1px solid #ddd" }}>{cliente.email}</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* verificacao de pesquisa */}
			<div
				style={{
					marginTop: "20px",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<button onClick={paginaAnt} disabled={paginaAtual === 1}>
					Anterior
				</button>
				<span>
					Página {paginaAtual} de {totalPaginas}
				</span>
				<button onClick={proxPagina} disabled={paginaAtual === totalPaginas}>
					Próxima
				</button>
			</div>
		</div>
	);
}
