import { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import type { Cliente } from "../../types";
import { buscarClientes } from "../../services/serviceData";
import { COLUNAS, type ChaveColuna } from "./columns";
import styles from "./ClientListPage.module.css";
import iconeFiltro from "../../assets/filter.svg";
import iconeBusca from "../../assets/search.svg";
import { normalizarTexto, formatarValor } from "../../utils/formatters";

const ITENS_POR_PAGINA = 10;
type VisibilidadeColunas = Record<ChaveColuna, boolean>;

const formatarValorCelula = (cliente: Cliente, chave: ChaveColuna) => {
  const valor = cliente[chave];
  switch (chave) {
    case "dataNascimento":
      return (valor as Date).toLocaleDateString("pt-BR");
    case "rendaAnual":
    case "patrimonio":
      return formatarValor(valor as number);
    default:
      return String(valor ?? "-");
  }
};

export function ClientListPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const refDropdown = useRef<HTMLDivElement>(null);

  const [visibilidadeColunas, setVisibilidadeColunas] = useState<VisibilidadeColunas>(() => {
    const colunasPadrao: ChaveColuna[] = ["cpfCnpj", "email"];
    const estadoInicial = Object.fromEntries(
      COLUNAS.map(c => [c.chave, colunasPadrao.includes(c.chave)])
    );
    return estadoInicial as VisibilidadeColunas;
  });

  useEffect(() => {
    buscarClientes()
      .then(setClientes)
      .catch(() => setErro("Falha ao carregar a lista de clientes!"))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    const tratarCliqueFora = (evento: MouseEvent) => {
      if (refDropdown.current && !refDropdown.current.contains(evento.target as Node)) {
        setDropdownAberto(false);
      }
    }
    document.addEventListener("mousedown", tratarCliqueFora);
    return () => document.removeEventListener("mousedown", tratarCliqueFora);
  }, []);

  const alterarVisibilidadeColuna = (chaveColuna: ChaveColuna) => {
    setVisibilidadeColunas(estadoAnterior => ({
      ...estadoAnterior,
      [chaveColuna]: !estadoAnterior[chaveColuna],
    }));
  };

  const clientesFiltrados = useMemo(() => {
    const buscaNormalizada = normalizarTexto(busca);
    if (!buscaNormalizada) return clientes;
    return clientes.filter(cliente =>
      normalizarTexto(cliente.nome).startsWith(buscaNormalizada) ||
      normalizarTexto(cliente.cpfCnpj).startsWith(buscaNormalizada)
    );
  }, [clientes, busca]);

  const totalPaginas = Math.ceil(clientesFiltrados.length / ITENS_POR_PAGINA);
  const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const clientesDaPagina = clientesFiltrados.slice(indiceInicial, indiceInicial + ITENS_POR_PAGINA);

  if (carregando) return <h1>Carregando...</h1>;
  if (erro) return <h1>{erro}</h1>;

  return (
    <div>
      <div className={styles.controles}>
        <div style={{ position: "relative" }} ref={refDropdown}>
          <button onClick={() => setDropdownAberto(!dropdownAberto)} className={styles.botaoFiltro}>
            <img src={iconeFiltro} alt="Filtrar" style={{ height: "1rem", filter: "brightness(0) invert(1)" }} />
            Filtro
          </button>
          {dropdownAberto && (
            <div className={styles.menuDropdown}>
              {COLUNAS.map((coluna) => (
                <label key={coluna.chave} className={styles.itemDropdown}>
                  <input
                    type="checkbox"
                    checked={visibilidadeColunas[coluna.chave]}
                    onChange={() => alterarVisibilidadeColuna(coluna.chave)}
                  />
                  <span className={styles.marcadorCheckbox}></span>
                  {coluna.rotulo}
                </label>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.containerBusca}>
          <input
            type="text"
            placeholder="Busque por nome ou CPF/CNPJ"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPaginaAtual(1); }}
            className={styles.campoBusca}
          />
          <img src={iconeBusca} alt="Buscar" className={styles.iconeBusca} />
        </div>
      </div>

      <div className={styles.containerTabela}>
        <table className={styles.tabela}>
          <thead>
            <tr className={styles.cabecalhoTabela}>
              <th>Nome</th>
              {COLUNAS.map((coluna) => 
                visibilidadeColunas[coluna.chave] && <th key={coluna.chave}>{coluna.rotulo}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {clientesDaPagina.map(cliente => (
              <tr key={cliente.id} className={styles.linhaTabela}>
                <td className={styles.celulaTabela}>
                  <Link to={`/cliente/${cliente.id}`}>{cliente.nome}</Link>
                </td>
                {COLUNAS.map((coluna) => 
                  visibilidadeColunas[coluna.chave] && (
                    <td key={coluna.chave} className={styles.celulaTabela}>
                      {formatarValorCelula(cliente, coluna.chave)}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.paginacao}>
        <button onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))} disabled={paginaAtual === 1}>
          &lt; Anterior
        </button>
        <span>Página {paginaAtual} de {totalPaginas}</span>
        <button onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas))} disabled={paginaAtual === totalPaginas}>
          Próximo &gt;
        </button>
      </div>
    </div>
  );
}