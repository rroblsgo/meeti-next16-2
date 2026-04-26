'use client';

import { useFormContext } from 'react-hook-form';
import { FormError, FormInput, FormLabel } from '@/src/shared/components/forms';
import { DeudorInput } from '../schemas/deudorSchema';

export default function DeudorForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<DeudorInput>();

  return (
    <div className="space-y-5">
      {/* Nombre + DNI */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FormLabel htmlFor="nombre">Nombre completo *</FormLabel>
          <FormInput
            id="nombre"
            type="text"
            placeholder="Nombre y apellidos"
            {...register('nombre')}
          />
          {errors.nombre && <FormError>{errors.nombre.message}</FormError>}
        </div>
        <div>
          <FormLabel htmlFor="dni">DNI / NIF</FormLabel>
          <FormInput
            id="dni"
            type="text"
            placeholder="12345678A"
            {...register('dni')}
          />
        </div>
      </div>

      {/* Dirección */}
      <div>
        <FormLabel htmlFor="direccionCompleta">Dirección completa</FormLabel>
        <textarea
          id="direccionCompleta"
          rows={2}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Calle, número, municipio, provincia..."
          {...register('direccionCompleta')}
        />
      </div>

      {/* Estado ocupacional */}
      <div>
        <FormLabel htmlFor="estadoOcupacional">Estado ocupacional</FormLabel>
        <textarea
          id="estadoOcupacional"
          rows={2}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Ej. Reside el deudor. Acuerdo de desalojo tras subasta..."
          {...register('estadoOcupacional')}
        />
      </div>

      {/* Vulnerabilidad */}
      <div>
        <FormLabel htmlFor="vulnerabilidad">Vulnerabilidad</FormLabel>
        <textarea
          id="vulnerabilidad"
          rows={2}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Ej. No consta declaración de vulnerabilidad..."
          {...register('vulnerabilidad')}
        />
      </div>

      {/* Notas internas */}
      <div>
        <FormLabel htmlFor="notas">Notas internas</FormLabel>
        <textarea
          id="notas"
          rows={3}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Notas de gestión interna..."
          {...register('notas')}
        />
      </div>

      {/* ¿Es el deudor principal? */}
      <div className="flex items-center gap-3 rounded-lg border border-orange-100 bg-orange-50 p-3">
        <input
          id="esPrincipal"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-orange-600"
          {...register('esPrincipal')}
        />
        <div>
          <FormLabel htmlFor="esPrincipal" className="mb-0 cursor-pointer font-semibold">
            Deudor principal
          </FormLabel>
          <p className="text-xs text-gray-500">
            Solo puede haber un deudor principal por NPL. Es el titular registral o ejecutado primario.
          </p>
        </div>
      </div>
    </div>
  );
}
