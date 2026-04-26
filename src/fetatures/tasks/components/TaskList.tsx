'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  TaskListItem,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_PRIORITIES,
} from '../types/task.types';
import TaskItem from './TaskItem';

const PAGE_SIZE = 10;

type Props = { tasks: TaskListItem[] };

export default function TaskList({ tasks }: Props) {
  // ── Filtros ────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterNpl, setFilterNpl] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo + 'T23:59:59') : null;

    return tasks.filter((t) => {
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);

      const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
      const matchPriority = filterPriority === 'ALL' || t.priority === filterPriority;
      const matchNpl =
        filterNpl === 'ALL' ||
        (filterNpl === 'WITH_NPL' && t.nplId !== null) ||
        (filterNpl === 'WITHOUT_NPL' && t.nplId === null);

      const fp = t.fechaPropuesta ? new Date(t.fechaPropuesta) : null;
      const matchDateFrom = !from || (fp !== null && fp >= from);
      const matchDateTo = !to || (fp !== null && fp <= to);

      return matchSearch && matchStatus && matchPriority && matchNpl && matchDateFrom && matchDateTo;
    });
  }, [tasks, search, filterStatus, filterPriority, filterNpl, dateFrom, dateTo]);

  // Reset to page 1 on filter change
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleFilterChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setter(e.target.value);
    setPage(1);
  };

  if (tasks.length === 0) {
    return (
      <p className="mt-10 text-center text-lg">
        No hay tareas aún:{' '}
        <Link href="/dashboard/tasks/create" className="font-bold text-orange-500">
          crea la primera
        </Link>
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-4">

      {/* ── Barra de filtros ─────────────────────────────────────────────── */}
      <div className="rounded-xl bg-white px-4 py-3 shadow-sm space-y-3">

        {/* Búsqueda por texto */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={handleFilterChange(setSearch)}
            placeholder="Buscar por título o descripción…"
            className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>

        {/* Selects + rango de fechas */}
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 shrink-0 text-gray-400" />

          <select
            value={filterStatus}
            onChange={handleFilterChange(setFilterStatus)}
            className="rounded-md border border-gray-200 px-2 py-1.5 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
          >
            <option value="ALL">Todos los estados</option>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={handleFilterChange(setFilterPriority)}
            className="rounded-md border border-gray-200 px-2 py-1.5 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
          >
            <option value="ALL">Todas las prioridades</option>
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>{TASK_PRIORITY_LABELS[p]}</option>
            ))}
          </select>

          <select
            value={filterNpl}
            onChange={handleFilterChange(setFilterNpl)}
            className="rounded-md border border-gray-200 px-2 py-1.5 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
          >
            <option value="ALL">Con o sin NPL</option>
            <option value="WITH_NPL">Con NPL vinculado</option>
            <option value="WITHOUT_NPL">Sin NPL</option>
          </select>

          {/* Rango de fecha propuesta */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span className="shrink-0 text-xs font-medium text-gray-400">F. propuesta:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={handleFilterChange(setDateFrom)}
              className="rounded-md border border-gray-200 px-2 py-1.5 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
            />
            <span className="text-gray-400">—</span>
            <input
              type="date"
              value={dateTo}
              onChange={handleFilterChange(setDateTo)}
              className="rounded-md border border-gray-200 px-2 py-1.5 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
            />
          </div>

          <span className="ml-auto text-sm text-gray-400">
            {filtered.length} de {tasks.length} tareas
          </span>
        </div>
      </div>

      {/* ── Lista ─────────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <p className="rounded-xl bg-white py-12 text-center text-sm text-gray-400 shadow-sm">
          No hay tareas con los filtros seleccionados.
        </p>
      ) : (
        <ul role="list" className="divide-y divide-gray-100 rounded-xl bg-white px-6 shadow-sm">
          {paginated.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}

      {/* ── Paginación ────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-gray-500">
            Página <span className="font-semibold">{safePage}</span> de{' '}
            <span className="font-semibold">{totalPages}</span>
            {' '}· {filtered.length} resultados
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`min-w-[2rem] rounded-md px-2 py-1 text-sm font-medium ${
                      p === safePage
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
