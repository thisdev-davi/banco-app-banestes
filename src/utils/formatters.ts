export function normalizarTexto(texto: string): string {
  if (typeof texto !== "string") return "";
  return texto.toLowerCase().replace(/[.\-/]/g, "");
}