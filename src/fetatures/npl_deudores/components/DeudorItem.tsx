'use client';

import Link from 'next/link';
import { SelectNplDeudor } from '../types/deudor.types';
import { useDeudorStore } from '../stores/deudor.store';

type Props = {
  deudor: SelectNplDeudor;
  nplId: number;
};

export default function DeudorItem({ deudor, nplId }: Props) {
  const { setDeleteOpen, setSelectedDeudor } = useDeudorStore();

  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1 space-y-1">
        {/* Nombre + badge principal */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-900">{deudor.nombre}</span>
          {deudor.esPrincipal && (
            <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 ring-1 ring-orange-600/20 ring-inset">
              Principal
            </span>
          )}
        </div>

        {/* DNI */}
        {deudor.dni && (
          <p className="text-sm text-gray-500">
            <span className="font-medium">DNI:</span> {deudor.dni}
          </p>
        )}

        {/* Dirección */}
        {deudor.direccionCompleta && (
          <p className="text-sm text-gray-500 line-clamp-1">
            <span className="font-medium">Dirección:</span> {deudor.direccionCompleta}
          </p>
        )}

        {/* Estado ocupacional */}
        {deudor.estadoOcupacional && (
          <p className="text-sm text-gray-500 line-clamp-1">
            <span className="font-medium">Ocupación:</span> {deudor.estadoOcupacional}
          </p>
        )}

        {/* Vulnerabilidad */}
        {deudor.vulnerabilidad && (
          <p className="text-sm text-gray-500 line-clamp-1">
            <span className="font-medium">Vulnerabilidad:</span> {deudor.vulnerabilidad}
          </p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex shrink-0 gap-2">
        <Link
          href={`/dashboard/npl/${nplId}/deudores/${deudor.id}/edit`}
          className="rounded-md bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-100"
        >
          Editar
        </Link>
        <button
          onClick={() => {
            setSelectedDeudor(deudor);
            setDeleteOpen(true);
          }}
          className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
