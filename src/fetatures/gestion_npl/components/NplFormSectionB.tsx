'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { FormError, FormInput, FormLabel } from '@/src/shared/components/forms';
import { NplInput } from '../schemas/nplSchema';

const formatEuros = (v: number | null) => {
  if (v === null) return '—';
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v);
};

export default function NplFormSectionB() {
  const {
    register,
    formState: { errors },
  } = useFormContext<NplInput>();

  // Cálculo en vivo de ROI estimado
  const coste = useWatch({ name: 'costeAdquisicionCredito' });
  const ajd = useWatch({ name: 'impuestosAjd' });
  const notaria = useWatch({ name: 'costesNotariaRegistro' });
  const mercado = useWatch({ name: 'precioMercado' });

  const toN = (v: string | undefined) => (v && !isNaN(parseFloat(v)) ? parseFloat(v) : null);
  const c = toN(coste);
  const a = toN(ajd);
  const n = toN(notaria);
  const m = toN(mercado);

  const inversionTotal = c !== null && a !== null && n !== null ? c + a + n : null;
  const beneficioNeto = inversionTotal !== null && m !== null ? m - inversionTotal : null;
  const roiNeto =
    beneficioNeto !== null && inversionTotal !== null && inversionTotal > 0
      ? (beneficioNeto / inversionTotal) * 100
      : null;

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-900 border-b pb-2">B. Rentabilidad</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FormLabel htmlFor="costeAdquisicionCredito">Coste adquisición crédito (€)</FormLabel>
          <FormInput id="costeAdquisicionCredito" type="number" step="0.01" min="0" placeholder="0.00" {...register('costeAdquisicionCredito')} />
          {errors.costeAdquisicionCredito && <FormError>{errors.costeAdquisicionCredito.message}</FormError>}
        </div>
        <div>
          <FormLabel htmlFor="derechoCobroPrincipal">Derecho de cobro — principal (€)</FormLabel>
          <FormInput id="derechoCobroPrincipal" type="number" step="0.01" min="0" placeholder="0.00" {...register('derechoCobroPrincipal')} />
          {errors.derechoCobroPrincipal && <FormError>{errors.derechoCobroPrincipal.message}</FormError>}
        </div>
        <div>
          <FormLabel htmlFor="intereses">Intereses (€)</FormLabel>
          <FormInput id="intereses" type="number" step="0.01" min="0" placeholder="0.00" {...register('intereses')} />
          {errors.intereses && <FormError>{errors.intereses.message}</FormError>}
        </div>
        <div>
          <FormLabel htmlFor="costas">Costas (€)</FormLabel>
          <FormInput id="costas" type="number" step="0.01" min="0" placeholder="0.00" {...register('costas')} />
          {errors.costas && <FormError>{errors.costas.message}</FormError>}
        </div>
        <div>
          <FormLabel htmlFor="impuestosAjd">Impuestos AJD (€)</FormLabel>
          <FormInput id="impuestosAjd" type="number" step="0.01" min="0" placeholder="0.00" {...register('impuestosAjd')} />
          {errors.impuestosAjd && <FormError>{errors.impuestosAjd.message}</FormError>}
        </div>
        <div>
          <FormLabel htmlFor="costesNotariaRegistro">Costes notaría y registro (€)</FormLabel>
          <FormInput id="costesNotariaRegistro" type="number" step="0.01" min="0" placeholder="0.00" {...register('costesNotariaRegistro')} />
          {errors.costesNotariaRegistro && <FormError>{errors.costesNotariaRegistro.message}</FormError>}
        </div>
        <div>
          <FormLabel htmlFor="gastosDacion">Gastos dación (€)</FormLabel>
          <FormInput id="gastosDacion" type="number" step="0.01" min="0" placeholder="0.00" {...register('gastosDacion')} />
          {errors.gastosDacion && <FormError>{errors.gastosDacion.message}</FormError>}
        </div>
        <div>
          <FormLabel htmlFor="precioMercado">Precio de mercado (€)</FormLabel>
          <FormInput id="precioMercado" type="number" step="0.01" min="0" placeholder="0.00" {...register('precioMercado')} />
          {errors.precioMercado && <FormError>{errors.precioMercado.message}</FormError>}
        </div>
        <div>
          <FormLabel htmlFor="precioVentaRapida">Precio venta rápida (€)</FormLabel>
          <FormInput id="precioVentaRapida" type="number" step="0.01" min="0" placeholder="0.00" {...register('precioVentaRapida')} />
          {errors.precioVentaRapida && <FormError>{errors.precioVentaRapida.message}</FormError>}
        </div>
      </div>

      {/* Panel de ROI estimado en vivo */}
      {inversionTotal !== null && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <h4 className="text-sm font-semibold text-orange-800 mb-3">📊 Cálculo estimado (escenario principal)</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500">Inversión total</p>
              <p className="text-base font-bold text-gray-900">{formatEuros(inversionTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Beneficio neto</p>
              <p className={`text-base font-bold ${beneficioNeto !== null && beneficioNeto >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {formatEuros(beneficioNeto)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">ROI neto</p>
              <p className={`text-base font-bold ${roiNeto !== null && roiNeto >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {roiNeto !== null ? `${roiNeto.toFixed(2)} %` : '—'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
