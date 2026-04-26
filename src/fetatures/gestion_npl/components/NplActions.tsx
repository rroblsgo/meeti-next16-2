'use client';

import Link from 'next/link';
import { SelectNpl } from '../types/npl.types';
import { useNplStore } from '../stores/npl.store';

type Props = {
  npl: SelectNpl;
};

export default function NplActions({ npl }: Props) {
  const { setDeleteOpen, setSelectedNpl } = useNplStore();

  const handleDeleteClick = () => {
    setSelectedNpl(npl);
    setDeleteOpen(true);
  };

  return (
    <div className="flex shrink-0 gap-2">
      <Link
        href={`/dashboard/npl/${npl.id}`}
        className="rounded-md bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
      >
        Ver
      </Link>
      <Link
        href={`/dashboard/npl/${npl.id}/edit`}
        className="rounded-md bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-100"
      >
        Editar
      </Link>
      <button
        onClick={handleDeleteClick}
        className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
      >
        Eliminar
      </button>
    </div>
  );
}
