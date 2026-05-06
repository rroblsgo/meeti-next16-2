'use client';

import { Escenario, EscenarioCaso } from '../utils/npl-calc';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtEur = (v: number | null) => {
  if (v === null) return '—';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(v);
};

const colorBeneficio = (v: number | null) =>
  v === null ? 'text-gray-400' : v >= 0 ? 'text-emerald-600' : 'text-red-600';

// ── Chip de desglose de inversión ─────────────────────────────────────────────
function DesgloseCosto({
  inversionBase,
  costeExtra,
  costeTotal,
}: {
  inversionBase: number | null;
  costeExtra: string | null;
  costeTotal: number | null;
}) {
  return (
    <div className="rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-600 mb-3">
      <span className="font-semibold text-gray-800">{fmtEur(costeTotal)}</span>
      {inversionBase !== null && (
        <span className="text-gray-400">
          {' '}
          = {fmtEur(inversionBase)} base
          {costeExtra ? (
            <span className="text-gray-500"> + {costeExtra}</span>
          ) : null}
        </span>
      )}
    </div>
  );
}

// ── Fila de caso ──────────────────────────────────────────────────────────────
function FilaCaso({
  caso,
  principal,
}: {
  caso: EscenarioCaso;
  principal: boolean;
}) {
  return (
    <div className="space-y-1.5 text-sm">
      <div className="flex justify-between text-gray-500">
        <span>Ingreso ({caso.label})</span>
        <span className="font-medium text-gray-700">
          {fmtEur(caso.ingreso)}
        </span>
      </div>
      <div
        className={`flex justify-between font-semibold border-t pt-1.5 ${colorBeneficio(caso.beneficio)}`}
      >
        <span>Beneficio</span>
        <span className={principal ? 'text-base' : ''}>
          {fmtEur(caso.beneficio)}
        </span>
      </div>
      <div className={`flex justify-between ${colorBeneficio(caso.roi)}`}>
        <span className="text-gray-500 font-normal text-xs">ROI neto</span>
        <span className={`font-bold ${principal ? 'text-base' : 'text-sm'}`}>
          {caso.roi !== null ? `${caso.roi.toFixed(2)} %` : '—'}
          {caso.roiAnual !== null && (
            <span className="ml-1 text-xs font-normal text-gray-400">
              ({caso.roiAnual.toFixed(2)} % anual)
            </span>
          )}
        </span>
      </div>
      {caso.dias !== null && (
        <div className="flex justify-between text-gray-400 text-xs">
          <span>Plazo</span>
          <span>{caso.dias} días</span>
        </div>
      )}
    </div>
  );
}

// ── Tarjeta de escenario ───────────────────────────────────────────────────────
function TarjetaEscenario({ escenario }: { escenario: Escenario }) {
  const { titulo, icono, principal, inversionBase, costeExtra, casoA, casoB } =
    escenario;

  return (
    <div
      className={`rounded-xl border p-4 space-y-3 ${
        principal
          ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-300'
          : 'border-gray-200 bg-white'
      }`}
    >
      {/* Cabecera */}
      <div className="flex items-start gap-2">
        <span className="text-base">{icono}</span>
        <h4
          className={`text-xs font-bold uppercase tracking-wide leading-tight ${
            principal ? 'text-blue-800' : 'text-gray-600'
          }`}
        >
          {titulo}
          {principal && (
            <span className="ml-2 text-[10px] font-medium bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded-full normal-case">
              Principal
            </span>
          )}
        </h4>
      </div>

      {/* Desglose inversión */}
      <DesgloseCosto
        inversionBase={inversionBase}
        costeExtra={costeExtra}
        costeTotal={casoA.coste}
      />

      {/* Caso A */}
      <FilaCaso caso={casoA} principal={principal} />

      {/* Caso B si difiere */}
      {casoB.label !== casoA.label && (
        <>
          <div className="border-t border-dashed border-gray-300" />
          <p className="text-[10px] uppercase tracking-wider text-gray-400">
            Variante — {casoB.label}
          </p>
          <FilaCaso caso={casoB} principal={false} />
        </>
      )}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function NplEscenariosRentabilidad({
  escenarios,
}: {
  escenarios: Escenario[];
  inversionTotal?: number | null; // mantenido por compatibilidad, ya no se usa
}) {
  if (
    escenarios.every((e) => e.casoA.ingreso === null && e.casoA.coste === null)
  ) {
    return (
      <p className="text-sm text-gray-400 italic">
        Completa los campos de rentabilidad para ver los escenarios.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {escenarios.map((esc) => (
        <TarjetaEscenario key={esc.titulo} escenario={esc} />
      ))}
    </div>
  );
}
