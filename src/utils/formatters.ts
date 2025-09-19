export function normalizarTexto(texto: string): string {
  if (typeof texto !== "string") return "";
  return texto.toLowerCase().replace(/[.\-/]/g, "");
}

const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatarValor(valor: number): string {
  if (typeof valor !== "number" || isNaN(valor)) return "R$ 0,00";
  return formatadorMoeda.format(valor);
}