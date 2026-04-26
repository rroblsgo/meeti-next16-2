'use client';

import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { FormError, FormInput, FormLabel } from '@/src/shared/components/forms';
import { NplInput } from '../schemas/nplSchema';
import {
  NPL_PROCEDIMIENTOS,
  NPL_PROCEDIMIENTO_LABELS,
} from '../types/npl.types';
import NplRichTextEditor from './NplRichTextEditor';

export default function NplFormSectionC() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<NplInput>();

  const procuradoresField = useFieldArray({
    control,
    name: 'procuradores' as never,
  });
  const ejecutadosField = useFieldArray({
    control,
    name: 'ejecutados' as never,
  });

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-900 border-b pb-2">
        C. Estado real y procesal
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FormLabel htmlFor="procedimiento">Procedimiento</FormLabel>
          <select
            id="procedimiento"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            {...register('procedimiento')}
          >
            <option value="">Selecciona...</option>
            {NPL_PROCEDIMIENTOS.map((p) => (
              <option key={p} value={p}>
                {NPL_PROCEDIMIENTO_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FormLabel htmlFor="nig">NIG</FormLabel>
          <FormInput
            id="nig"
            type="text"
            placeholder="Ej. 30015 41 1 2016 0000834"
            {...register('nig')}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FormLabel htmlFor="juzgado">Juzgado</FormLabel>
          <FormInput
            id="juzgado"
            type="text"
            placeholder="Juzgado de 1ª Instancia..."
            {...register('juzgado')}
          />
        </div>
        <div>
          <FormLabel htmlFor="ejecutante">Ejecutante</FormLabel>
          <FormInput
            id="ejecutante"
            type="text"
            placeholder="Entidad ejecutante..."
            {...register('ejecutante')}
          />
        </div>
      </div>

      {/* Procuradores dinámicos */}
      <div>
        <FormLabel>Procuradores</FormLabel>
        <div className="space-y-2">
          {(procuradoresField.fields as { id: string }[]).map(
            (field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormInput
                  type="text"
                  placeholder="Nombre del procurador"
                  {...register(`procuradores.${index}` as const)}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => procuradoresField.remove(index)}
                  className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600 hover:bg-red-100"
                >
                  ✕
                </button>
              </div>
            )
          )}
          <button
            type="button"
            onClick={() => procuradoresField.append('' as never)}
            className="text-sm text-orange-600 hover:underline"
          >
            + Añadir procurador
          </button>
        </div>
      </div>

      {/* Ejecutados dinámicos */}
      <div>
        <FormLabel>Ejecutados</FormLabel>
        <div className="space-y-2">
          {(ejecutadosField.fields as { id: string }[]).map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormInput
                type="text"
                placeholder="Nombre del ejecutado"
                {...register(`ejecutados.${index}` as const)}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => ejecutadosField.remove(index)}
                className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600 hover:bg-red-100"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => ejecutadosField.append('' as never)}
            className="text-sm text-orange-600 hover:underline"
          >
            + Añadir ejecutado
          </button>
        </div>
      </div>

      <div>
        <FormLabel htmlFor="autoDespachoJuez">
          Auto de despacho del juez
        </FormLabel>
        <textarea
          id="autoDespachoJuez"
          rows={3}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          {...register('autoDespachoJuez')}
        />
      </div>

      <div>
        <FormLabel htmlFor="prestamoHipotecaDetalles">
          Préstamo / hipoteca — detalles
        </FormLabel>
        <textarea
          id="prestamoHipotecaDetalles"
          rows={3}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Entidad, escritura, capital, cesión..."
          {...register('prestamoHipotecaDetalles')}
        />
      </div>

      <div>
        <FormLabel htmlFor="importeDespachado">
          Importe despachado (€)
        </FormLabel>
        <FormInput
          id="importeDespachado"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register('importeDespachado')}
        />
        {errors.importeDespachado && (
          <FormError>{errors.importeDespachado.message}</FormError>
        )}
      </div>

      {/* ─── Información para el inversor — editor TipTap ─────────────────── */}
      <div>
        <FormLabel>Actuaciones seguidas</FormLabel>
        <Controller
          control={control}
          name="actuacionesSeguidas"
          render={({ field }) => (
            <NplRichTextEditor
              value={field.value ?? ''}
              onChange={field.onChange}
              error={errors.actuacionesSeguidas?.message}
              placeholder="Hitos procesales, fechas relevantes..."
            />
          )}
        />
      </div>

      {/* ─── Información para el inversor — editor TipTap ─────────────────── */}
      <div>
        <FormLabel>Información para el inversor</FormLabel>
        <Controller
          control={control}
          name="informacionInversor"
          render={({ field }) => (
            <NplRichTextEditor
              value={field.value ?? ''}
              onChange={field.onChange}
              error={errors.informacionInversor?.message}
              placeholder="Texto orientado al inversor: estrategia recomendada, ROI estimado, plazos, condiciones especiales..."
            />
          )}
        />
      </div>
    </div>
  );
}
