import { Outlet, Link, useLocation } from "react-router-dom";
import estilos from "./Layout.module.css";
import urlLogotipo from "../../assets/logo.svg";
import urlIconeHome from "../../assets/home.svg"; 

export function Layout() {
  const localizacao = useLocation();
  const ePaginaInicial = localizacao.pathname === '/';

  return (
    <div>
      <header className={estilos.cabecalho}>
        <div className={estilos.conteudoCabecalho}>
          <Link to="/" title="Ir para a página inicial">
            <img src={urlLogotipo} className={estilos.logotipo} alt="Logotipo - Início" />
          </Link>
          
          {!ePaginaInicial && (
            <Link to="/" className={estilos.linkHome} title="Voltar para a página inicial">
              <img src={urlIconeHome} className={estilos.iconeHome} alt="Home" />
            </Link>
          )}
        </div>
      </header>
      <main className={estilos.conteudoPrincipal}>
        <Outlet />
      </main>
    </div>
  );
}