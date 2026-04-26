import { SelectNpl, NplRentabilidad } from '../types/npl.types';

const toNum = (v: string | null | undefined): number | null => {
  if (!v) return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
};

export function calcularRentabilidad(npl: SelectNpl): NplRentabilidad {
  const coste = toNum(npl.costeAdquisicionCredito);
  const ajd = toNum(npl.impuestosAjd);
  const notaria = toNum(npl.costesNotariaRegistro);
  const mercado = toNum(npl.precioMercado);

  const inversionTotal =
    coste !== null && ajd !== null && notaria !== null
      ? coste + ajd + notaria
      : null;

  const beneficioNeto =
    inversionTotal !== null && mercado !== null
      ? mercado - inversionTotal
      : null;

  const roiNeto =
    beneficioNeto !== null && inversionTotal !== null && inversionTotal > 0
      ? (beneficioNeto / inversionTotal) * 100
      : null;

  return { inversionTotal, beneficioNeto, roiNeto };
}
