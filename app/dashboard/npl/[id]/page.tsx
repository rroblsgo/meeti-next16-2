import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/src/lib/auth-server';
import { nplService } from '@/src/fetatures/gestion_npl/services/NplService';
import { NplPolicy } from '@/src/fetatures/gestion_npl/policies/NplPolicy';
import { calcularRentabilidad } from '@/src/fetatures/gestion_npl/utils/npl-calc';
import {
  NPL_TIPO_INMUEBLE_LABELS,
  NPL_PROCEDIMIENTO_LABELS,
  NPL_ESTADO_LABELS,
} from '@/src/fetatures/gestion_npl/types/npl.types';
import { deudorService } from '@/src/fetatures/npl_deudores/services/DeudorService';
import RichTextContent from '@/src/shared/components/ui/RichTextContent';
import NplStatusBadge from '@/src/fetatures/gestion_npl/components/NplStatusBadge';
import { generatePageTitle } from '@/src/shared/utils/metadata';
import DownloadPdfButton from '@/src/fetatures/gestion_npl/components/DownloadPdfButton';
import { documentService } from '@/src/fetatures/documents/services/DocumentService';
import DocumentsList from '@/src/fetatures/documents/components/DocumentsList';
import { taskService } from '@/src/fetatures/tasks/services/TaskService';
import NplTasksSection from '@/src/fetatures/tasks/components/NplTasksSection';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ id: string }> };

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const npl = await nplService.getNpl(Number(id));
  return { title: generatePageTitle(npl.tituloOperacion) };
}


// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: string | null | undefined) =>
  v
    ? new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(parseFloat(v))
    : null;

// ─── Sub-componentes ──────────────────────────────────────────────────────────

// Fila de datos: label + valor — no renderiza si valor es nulo/vacío
function DataRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}

// Sección con título y contenido
function Section({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ${className}`}>
      <h2 className="mb-4 border-b pb-2 text-sm font-bold uppercase tracking-wider text-gray-500">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function NplDetailDashboardPage({ params }: Props) {
  const { session } = await requireAuth();
  if (!session) redirect('/auth/login');

  const { id } = await params;
  const npl = await nplService.getNpl(Number(id));

  // Solo el creador puede ver el detalle completo en el dashboard
  if (!NplPolicy.canView(session.user, npl)) redirect('/dashboard/npl');

  // Cargar deudores, rentabilidad, documentos y tareas en paralelo
  const [deudores, rentabilidad, documents, nplTasks] = await Promise.all([
    deudorService.listByNpl(npl.id),
    Promise.resolve(calcularRentabilidad(npl)),
    documentService.listByEntity('NPL', npl.id),
    taskService.listTasksByNpl(npl.id),
  ]);

  const { roiNeto, inversionTotal, beneficioNeto } = rentabilidad;

  return (
    <div className="space-y-6 pb-12">
      {/* ── Cabecera ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {npl.tituloOperacion}
            </h1>
            <NplStatusBadge estado={npl.estado} />
            {npl.esPublico && (
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                Público
              </span>
            )}
          </div>
          {(npl.municipio || npl.provincia) && (
            <p className="mt-1 text-sm text-gray-500">
              📍{' '}
              {[npl.municipio, npl.provincia, npl.codigoPostal]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
          {npl.referenciaOrigen && (
            <p className="mt-0.5 font-mono text-xs text-gray-400">
              {npl.referenciaOrigen}
            </p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex shrink-0 gap-2">
          <Link
            href={`/dashboard/npl/${npl.id}/edit`}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Editar
          </Link>
          <DownloadPdfButton
            nplId={npl.id}
            tituloOperacion={npl.tituloOperacion}
          />
          <Link
            href="/dashboard/npl"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            ← Volver
          </Link>
        </div>
      </div>

      {/* ── Imagen principal ─────────────────────────────────────────────── */}
      {npl.imagenAsociada && (
        <div className="overflow-hidden rounded-xl shadow-sm">
          <Image
            src={npl.imagenAsociada}
            alt={npl.tituloOperacion}
            width={1200}
            height={500}
            className="h-72 w-full object-cover"
          />
        </div>
      )}

      {/* Imágenes adicionales */}
      {npl.imagenesAdicionales?.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {npl.imagenesAdicionales.map((url, i) => (
            <Image
              key={url}
              src={url}
              alt={`Imagen ${i + 2}`}
              width={200}
              height={140}
              className="h-32 w-44 rounded-lg object-cover shadow-sm"
            />
          ))}
        </div>
      )}

      {/* ── Métricas de rentabilidad ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Precio mercado', value: fmt(npl.precioMercado) },
          { label: 'Precio compra', value: fmt(npl.costeAdquisicionCredito) },
          {
            label: 'Beneficio neto',
            value: beneficioNeto !== null ? fmt(String(beneficioNeto)) : null,
          },
          {
            label: 'ROI neto',
            value: roiNeto !== null ? `${roiNeto.toFixed(2)} %` : null,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl bg-white p-4 text-center shadow-sm"
          >
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              {label}
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {value ?? '—'}
            </p>
          </div>
        ))}
      </div>

      {/* ── A. Datos registrales ──────────────────────────────────────────── */}
      <Section title="A. Superficies y datos registrales">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <DataRow
            label="Tipo de inmueble"
            value={NPL_TIPO_INMUEBLE_LABELS[npl.tipoInmueble]}
          />
          <DataRow
            label="Superficie construida"
            value={npl.superficieConst ? `${npl.superficieConst} m²` : null}
          />
          <DataRow
            label="Superficie parcela"
            value={npl.superficieParcela ? `${npl.superficieParcela} m²` : null}
          />
          <DataRow label="Año de construcción" value={npl.anyConstruccion} />
          <DataRow label="Ref. catastral" value={npl.refCatastral} />
          <DataRow label="Finca registral" value={npl.fincaRegistral} />
          <DataRow label="Tasación subasta" value={fmt(npl.tasacionSubasta)} />
          {npl.superficieDetalles && (
            <div className="col-span-2 sm:col-span-3">
              <DataRow
                label="Detalles superficies"
                value={npl.superficieDetalles}
              />
            </div>
          )}
          {npl.distribucionResumida && (
            <div className="col-span-2 sm:col-span-3">
              <DataRow label="Distribución" value={npl.distribucionResumida} />
            </div>
          )}
          {npl.distribucion && npl.distribucion !== '<p></p>' && (
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-sm font-medium text-gray-500">Distribución detallada</dt>
              <dd className="mt-1">
                <RichTextContent html={npl.distribucion} />
              </dd>
            </div>
          )}
          {npl.datosRegistro && (
            <div className="col-span-2 sm:col-span-3">
              <DataRow label="Datos de registro" value={npl.datosRegistro} />
            </div>
          )}
          {npl.direccion && (
            <div className="col-span-2 sm:col-span-3">
              <DataRow label="Dirección" value={npl.direccion} />
            </div>
          )}
        </dl>
      </Section>

      {/* ── B. Rentabilidad ──────────────────────────────────────────────── */}
      <Section title="B. Rentabilidad">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <DataRow
            label="Coste adquisición crédito"
            value={fmt(npl.costeAdquisicionCredito)}
          />
          <DataRow
            label="Derecho de cobro (principal)"
            value={fmt(npl.derechoCobroPrincipal)}
          />
          <DataRow label="Intereses" value={fmt(npl.intereses)} />
          <DataRow label="Costas" value={fmt(npl.costas)} />
          <DataRow label="Impuestos AJD" value={fmt(npl.impuestosAjd)} />
          <DataRow
            label="Costes notaría y registro"
            value={fmt(npl.costesNotariaRegistro)}
          />
          <DataRow label="Gastos dación" value={fmt(npl.gastosDacion)} />
          <DataRow label="Precio de mercado" value={fmt(npl.precioMercado)} />
          <DataRow
            label="Precio venta rápida"
            value={fmt(npl.precioVentaRapida)}
          />
          <DataRow
            label="Comisión intermediación"
            value={fmt(npl.comisionIntermediacion)}
          />
          <DataRow label="Puja probable" value={fmt(npl.pujaProbable)} />
          {npl.fechaCompra && (
            <DataRow label="Fecha de compra" value={npl.fechaCompra} />
          )}
          {npl.fechaTerminacion && (
            <DataRow label="Fecha de terminación" value={npl.fechaTerminacion} />
          )}
        </dl>

        {/* Gastos diversos */}
        {Array.isArray(npl.gastosDiversos) && (npl.gastosDiversos as { titulo: string; valor: number }[]).length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Gastos diversos</h4>
            <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(npl.gastosDiversos as { titulo: string; valor: number }[]).map((g, i) => (
                <DataRow key={i} label={g.titulo} value={fmt(String(g.valor))} />
              ))}
            </dl>
          </div>
        )}

        {/* Panel resumen ROI */}
        {inversionTotal !== null && (
          <div className="mt-4 rounded-lg bg-orange-50 p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-orange-600">
                  Inversión total
                </p>
                <p className="font-bold text-gray-900">
                  {fmt(String(inversionTotal))}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-orange-600">
                  Beneficio neto
                </p>
                <p
                  className={`font-bold ${
                    beneficioNeto !== null && beneficioNeto >= 0
                      ? 'text-green-700'
                      : 'text-red-600'
                  }`}
                >
                  {beneficioNeto !== null ? fmt(String(beneficioNeto)) : '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-orange-600">
                  ROI neto
                </p>
                <p
                  className={`font-bold ${
                    roiNeto !== null && roiNeto >= 0
                      ? 'text-green-700'
                      : 'text-red-600'
                  }`}
                >
                  {roiNeto !== null ? `${roiNeto.toFixed(2)} %` : '—'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* ── C. Estado procesal ───────────────────────────────────────────── */}
      <Section title="C. Estado real y procesal">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <DataRow
            label="Procedimiento"
            value={
              npl.procedimiento
                ? NPL_PROCEDIMIENTO_LABELS[npl.procedimiento]
                : null
            }
          />
          <DataRow label="NIG" value={npl.nig} />
          <DataRow label="Juzgado" value={npl.juzgado} />
          <DataRow label="Ejecutante" value={npl.ejecutante} />
          <DataRow
            label="Importe despachado"
            value={fmt(npl.importeDespachado)}
          />
          {npl.procuradores?.length > 0 && (
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-xs uppercase tracking-wide text-gray-400">
                Procuradores
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-gray-900">
                {npl.procuradores.join(' · ')}
              </dd>
            </div>
          )}
          {npl.ejecutados?.length > 0 && (
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-xs uppercase tracking-wide text-gray-400">
                Ejecutados
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-gray-900">
                {npl.ejecutados.join(' · ')}
              </dd>
            </div>
          )}
          {npl.autoDespachoJuez && (
            <div className="col-span-2 sm:col-span-3">
              <DataRow
                label="Auto de despacho del juez"
                value={npl.autoDespachoJuez}
              />
            </div>
          )}
          {npl.prestamoHipotecaDetalles && (
            <div className="col-span-2 sm:col-span-3">
              <DataRow
                label="Préstamo / hipoteca"
                value={npl.prestamoHipotecaDetalles}
              />
            </div>
          )}
        </dl>

        {npl.actuacionesSeguidas && (
          <div className="mt-4 border-t pt-4">
            <p className="mb-2 text-xs uppercase tracking-wider text-gray-400">
              Actuaciones seguidas
            </p>
            <RichTextContent
              html={npl.actuacionesSeguidas}
              className="text-gray-700"
            />
          </div>
        )}

        {npl.informacionInversor && (
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="mb-2 text-xs uppercase tracking-wider text-blue-600">
              Información para el inversor
            </p>
            <RichTextContent
              html={npl.informacionInversor}
              className="text-blue-800"
            />
          </div>
        )}
      </Section>

      {/* ── D. Deudores ──────────────────────────────────────────────────── */}
      <Section title="D. Deudores">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {deudores.length === 0
              ? 'Sin deudores registrados.'
              : `${deudores.length} deudor${deudores.length > 1 ? 'es' : ''} registrado${deudores.length > 1 ? 's' : ''}.`}
          </p>
          <Link
            href={`/dashboard/npl/${npl.id}/deudores`}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Gestionar deudores
          </Link>
        </div>

        {deudores.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {deudores.map((d) => (
              <li key={d.id} className="py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {d.nombre}
                  </span>
                  {d.esPrincipal && (
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                      Principal
                    </span>
                  )}
                  {d.dni && (
                    <span className="text-sm text-gray-500">DNI: {d.dni}</span>
                  )}
                </div>
                {d.direccionCompleta && (
                  <p className="mt-0.5 text-sm text-gray-500">
                    {d.direccionCompleta}
                  </p>
                )}
                {d.estadoOcupacional && (
                  <p className="mt-0.5 text-sm text-gray-500">
                    {d.estadoOcupacional}
                  </p>
                )}
                {d.vulnerabilidad && (
                  <p className="mt-0.5 text-sm font-medium text-amber-700">
                    ⚠ {d.vulnerabilidad}
                  </p>
                )}
                {d.notas && (
                  <p className="mt-0.5 text-sm italic text-gray-400">
                    {d.notas}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* ── E. Tareas / Actuaciones ──────────────────────────────────────── */}
      <NplTasksSection nplId={npl.id} tasks={nplTasks} />

      {/* ── Adjuntos ─────────────────────────────────────────────────────── */}
      <Section title="Documentos adjuntos">
        <DocumentsList documents={documents} />
      </Section>

      {/* ── Control interno ──────────────────────────────────────────────── */}
      <Section title="Control interno">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DataRow label="Estado" value={NPL_ESTADO_LABELS[npl.estado]} />
          <DataRow
            label="Visibilidad"
            value={npl.esPublico ? 'Público' : 'Privado'}
          />
          <DataRow
            label="Creado"
            value={new Date(npl.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          />
          <DataRow
            label="Actualizado"
            value={new Date(npl.updatedAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          />
        </dl>
      </Section>
    </div>
  );
}
