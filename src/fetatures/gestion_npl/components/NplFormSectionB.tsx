'use client';

import { useFormContext, useWatch, useFieldArray } from 'react-hook-form';
import { FormError, FormInput, FormLabel } from '@/src/shared/components/forms';
import { NplInput } from '../schemas/nplSchema';
import { Plus, Trash2 } from 'lucide-react';
import NplEscenariosRentabilidad from './NplEscenariosRentabilidad';
import { calcularRentabilidad } from '../utils/npl-calc';

const formatEuros = (v: number | null) => {
  if (v === null) return '—';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(v);
};

export default function NplFormSectionB() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<NplInput>();

  // ── Gestor de gastos diversos ──────────────────────────────────────────────
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'gastosDiversos',
  });

  // ── Cálculo en vivo de ROI estimado ───────────────────────────────────────
  const watchedFields = useWatch({
    name: [
      'costeAdquisicionCredito',
      'impuestosAjd',
      'costesNotariaRegistro',
      'comisionIntermediacion',
      'derechoCobroPrincipal',
      'intereses',
      'costas',
      'gastosDacion',
      'precioMercado',
      'precioVentaRapida',
      'pujaProbable',
      'fechaCompra',
      'fechaTerminacion',
      'gastosDiversos',
    ],
  });
  const [
    coste,
    ajd,
    notaria,
    comisionInterm,
    derechoCobro,
    intereses,
    costas,
    gastosDacion,
    mercado,
    ventaRapida,
    puja,
    fechaCompra,
    fechaTerminacion,
    gastosDiversos,
  ] = watchedFields;

  const toN = (v: string | undefined) =>
    v && !isNaN(parseFloat(v)) ? parseFloat(v) : null;

  const c = toN(coste);
  const a = toN(ajd);
  const n = toN(notaria);
  const m = toN(mercado);

  const sumGastosDiversos =
    gastosDiversos?.reduce(
      (acc: number, g: { titulo: string; valor: number }) =>
        acc + (Number(g.valor) || 0),
      0
    ) ?? 0;

  const inversionTotal =
    c !== null && a !== null && n !== null
      ? c + a + n + sumGastosDiversos
      : null;
  const beneficioNeto =
    inversionTotal !== null && m !== null ? m - inversionTotal : null;
  const roiNeto =
    beneficioNeto !== null && inversionTotal !== null && inversionTotal > 0
      ? (beneficioNeto / inversionTotal) * 100
      : null;

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-900 border-b pb-2">
        B. Rentabilidad
      </h3>

      {/* ── Costes y valoraciones ─────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FormLabel htmlFor="costeAdquisicionCredito">
            Coste adquisición crédito (€)
          </FormLabel>
          <FormInput
            id="costeAdquisicionCredito"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('costeAdquisicionCredito')}
          />
          {errors.costeAdquisicionCredito && (
            <FormError>{errors.costeAdquisicionCredito.message}</FormError>
          )}
        </div>
        <div>
          <FormLabel htmlFor="derechoCobroPrincipal">
            Derecho de cobro — principal (€)
          </FormLabel>
          <FormInput
            id="derechoCobroPrincipal"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('derechoCobroPrincipal')}
          />
          {errors.derechoCobroPrincipal && (
            <FormError>{errors.derechoCobroPrincipal.message}</FormError>
          )}
        </div>
        <div>
          <FormLabel htmlFor="intereses">Intereses (€)</FormLabel>
          <FormInput
            id="intereses"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('intereses')}
          />
          {errors.intereses && (
            <FormError>{errors.intereses.message}</FormError>
          )}
        </div>
        <div>
          <FormLabel htmlFor="costas">Costas (€)</FormLabel>
          <FormInput
            id="costas"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('costas')}
          />
          {errors.costas && <FormError>{errors.costas.message}</FormError>}
        </div>
        <div>
          <FormLabel htmlFor="impuestosAjd">Impuestos AJD (€)</FormLabel>
          <FormInput
            id="impuestosAjd"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('impuestosAjd')}
          />
          {errors.impuestosAjd && (
            <FormError>{errors.impuestosAjd.message}</FormError>
          )}
        </div>
        <div>
          <FormLabel htmlFor="costesNotariaRegistro">
            Costes notaría y registro (€)
          </FormLabel>
          <FormInput
            id="costesNotariaRegistro"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('costesNotariaRegistro')}
          />
          {errors.costesNotariaRegistro && (
            <FormError>{errors.costesNotariaRegistro.message}</FormError>
          )}
        </div>
        <div>
          <FormLabel htmlFor="gastosDacion">Gastos dación (€)</FormLabel>
          <FormInput
            id="gastosDacion"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('gastosDacion')}
          />
          {errors.gastosDacion && (
            <FormError>{errors.gastosDacion.message}</FormError>
          )}
        </div>
        <div>
          <FormLabel htmlFor="comisionIntermediacion">
            Comisión intermediación (€)
          </FormLabel>
          <FormInput
            id="comisionIntermediacion"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('comisionIntermediacion')}
          />
          {errors.comisionIntermediacion && (
            <FormError>{errors.comisionIntermediacion.message}</FormError>
          )}
        </div>
        <div>
          <FormLabel htmlFor="pujaProbable">Puja probable (€)</FormLabel>
          <FormInput
            id="pujaProbable"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('pujaProbable')}
          />
          {errors.pujaProbable && (
            <FormError>{errors.pujaProbable.message}</FormError>
          )}
        </div>
        <div>
          <FormLabel htmlFor="precioMercado">Precio de mercado (€)</FormLabel>
          <FormInput
            id="precioMercado"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('precioMercado')}
          />
          {errors.precioMercado && (
            <FormError>{errors.precioMercado.message}</FormError>
          )}
        </div>
        <div>
          <FormLabel htmlFor="precioVentaRapida">
            Precio venta rápida (€)
          </FormLabel>
          <FormInput
            id="precioVentaRapida"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('precioVentaRapida')}
          />
          {errors.precioVentaRapida && (
            <FormError>{errors.precioVentaRapida.message}</FormError>
          )}
        </div>
      </div>

      {/* ── Fechas ────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FormLabel htmlFor="fechaCompra">Fecha de compra</FormLabel>
          <FormInput
            id="fechaCompra"
            type="date"
            {...register('fechaCompra')}
          />
        </div>
        <div>
          <FormLabel htmlFor="fechaTerminacion">Fecha de terminación</FormLabel>
          <FormInput
            id="fechaTerminacion"
            type="date"
            {...register('fechaTerminacion')}
          />
        </div>
      </div>

      {/* ── Gastos diversos ───────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <FormLabel>Gastos diversos</FormLabel>
          <button
            type="button"
            onClick={() => append({ titulo: '', valor: 0 })}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Añadir gasto
          </button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            Sin gastos adicionales.
          </p>
        )}

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <FormInput
                  type="text"
                  placeholder="Concepto (ej. Rehabilitación)"
                  {...register(`gastosDiversos.${index}.titulo`)}
                />
                {errors.gastosDiversos?.[index]?.titulo && (
                  <FormError>
                    {errors.gastosDiversos[index].titulo?.message}
                  </FormError>
                )}
              </div>
              <div className="w-36">
                <FormInput
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register(`gastosDiversos.${index}.valor`, {
                    valueAsNumber: true,
                  })}
                />
                {errors.gastosDiversos?.[index]?.valor && (
                  <FormError>
                    {errors.gastosDiversos[index].valor?.message}
                  </FormError>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-1.5 text-red-400 hover:text-red-600"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Escenarios de rentabilidad en vivo ──────────────────────────── */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          📊 Escenarios de rentabilidad
        </h4>
        <NplEscenariosRentabilidad
          escenarios={
            calcularRentabilidad({
              costeAdquisicionCredito: coste,
              impuestosAjd: ajd,
              costesNotariaRegistro: notaria,
              comisionIntermediacion: comisionInterm,
              derechoCobroPrincipal: derechoCobro,
              intereses: intereses,
              costas: costas,
              gastosDacion: gastosDacion,
              precioMercado: mercado,
              precioVentaRapida: ventaRapida,
              pujaProbable: puja,
              fechaCompra: fechaCompra,
              fechaTerminacion: fechaTerminacion,
              gastosDiversos: gastosDiversos ?? [],
            }).escenarios
          }
          inversionTotal={
            calcularRentabilidad({
              costeAdquisicionCredito: coste,
              impuestosAjd: ajd,
              costesNotariaRegistro: notaria,
              comisionIntermediacion: comisionInterm,
              gastosDiversos: gastosDiversos ?? [],
            }).inversionTotal
          }
        />
      </div>
    </div>
  );
}
