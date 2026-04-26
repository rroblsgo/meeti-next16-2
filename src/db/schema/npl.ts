import {
  pgEnum,
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  numeric,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './auth-schema';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const nplEstadoEnum = pgEnum('npl_estado', [
  'ACTIVO',
  'RESERVADO',
  'VENDIDO',
  'ARCHIVADO',
]);

export const nplTipoInmuebleEnum = pgEnum('npl_tipo_inmueble', [
  'VIVIENDA',
  'LOCAL',
  'OFICINA',
  'GARAJE',
  'TRASTERO',
  'NAVE_INDUSTRIAL',
  'SOLAR',
  'FINCA_RUSTICA',
  'OTRO',
]);

export const nplProcedimientoEnum = pgEnum('npl_procedimiento', [
  'EJECUCION_HIPOTECARIA',
  'DACION_EN_PAGO',
  'ACUERDO_EXTRAJUDICIAL',
  'SUBASTA',
  'OTRO',
]);

// ─── Tabla principal NPL ──────────────────────────────────────────────────────
// NOTA: Los campos deudor_* han sido eliminados.
// Todos los deudores se gestionan en la tabla npl_deudores.

export const npl = pgTable('npls', {
  id: serial('id').primaryKey(),

  // A. Superficies y datos registrales
  tituloOperacion: varchar('titulo_operacion', { length: 255 }).notNull(),
  referenciaOrigen: varchar('referencia_origen', { length: 100 }),
  direccion: varchar('direccion', { length: 255 }),
  municipio: varchar('municipio', { length: 100 }),
  provincia: varchar('provincia', { length: 100 }),
  codigoPostal: varchar('codigo_postal', { length: 10 }),
  tipoInmueble: nplTipoInmuebleEnum('tipo_inmueble')
    .notNull()
    .default('VIVIENDA'),
  distribucion: text('distribucion'),
  superficieConst: numeric('superficie_const', { precision: 10, scale: 2 }),
  superficieParcela: numeric('superficie_parcela', { precision: 10, scale: 2 }),
  superficieDetalles: text('superficie_detalles'),
  anyConstruccion: integer('any_construccion'),
  refCatastral: varchar('ref_catastral', { length: 50 }),
  fincaRegistral: varchar('finca_registral', { length: 100 }),
  datosRegistro: text('datos_registro'),
  tasacionSubasta: numeric('tasacion_subasta', { precision: 14, scale: 2 }),
  imagenAsociada: varchar('imagen_asociada', { length: 255 }),
  imagenesAdicionales: text('imagenes_adicionales')
    .array()
    .notNull()
    .default([]),

  // B. Rentabilidad
  costeAdquisicionCredito: numeric('coste_adquisicion_credito', {
    precision: 14,
    scale: 2,
  }),
  derechoCobroPrincipal: numeric('derecho_cobro_principal', {
    precision: 14,
    scale: 2,
  }),
  intereses: numeric('intereses', { precision: 14, scale: 2 }),
  costas: numeric('costas', { precision: 14, scale: 2 }),
  impuestosAjd: numeric('impuestos_ajd', { precision: 14, scale: 2 }),
  costesNotariaRegistro: numeric('costes_notaria_registro', {
    precision: 14,
    scale: 2,
  }),
  gastosDacion: numeric('gastos_dacion', { precision: 14, scale: 2 }),
  precioMercado: numeric('precio_mercado', { precision: 14, scale: 2 }),
  precioVentaRapida: numeric('precio_venta_rapida', {
    precision: 14,
    scale: 2,
  }),

  // C. Estado real y procesal
  procedimiento: nplProcedimientoEnum('procedimiento').default(
    'EJECUCION_HIPOTECARIA'
  ),
  nig: varchar('nig', { length: 50 }),
  juzgado: varchar('juzgado', { length: 255 }),
  ejecutante: varchar('ejecutante', { length: 255 }),
  procuradores: text('procuradores').array().notNull().default([]),
  ejecutados: text('ejecutados').array().notNull().default([]),
  autoDespachoJuez: text('auto_despacho_juez'),
  prestamoHipotecaDetalles: text('prestamo_hipoteca_detalles'),
  importeDespachado: numeric('importe_despachado', { precision: 14, scale: 2 }),
  actuacionesSeguidas: text('actuaciones_seguidas'),
  informacionInversor: text('informacion_inversor'),

  // Control interno
  estado: nplEstadoEnum('estado').notNull().default('ACTIVO'),
  esPublico: boolean('es_publico').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  creatorId: text('creator_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

// ─── Tabla de deudores (todos los deudores de un NPL) ─────────────────────────
// esPrincipal=true → deudor principal (solo puede haber uno por NPL)
// esPrincipal=false → deudores adicionales (sin límite)

export const nplDeudores = pgTable('npl_deudores', {
  id: serial('id').primaryKey(),
  nplId: integer('npl_id')
    .notNull()
    .references(() => npl.id, { onDelete: 'cascade' }),
  esPrincipal: boolean('es_principal').notNull().default(false),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  dni: varchar('dni', { length: 20 }),
  direccionCompleta: text('direccion_completa'),
  estadoOcupacional: text('estado_ocupacional'),
  vulnerabilidad: text('vulnerabilidad'),
  notas: text('notas'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Tipos exportados ─────────────────────────────────────────────────────────

export type NplEstado = (typeof nplEstadoEnum.enumValues)[number];
export type NplTipoInmueble = (typeof nplTipoInmuebleEnum.enumValues)[number];
export type NplProcedimiento = (typeof nplProcedimientoEnum.enumValues)[number];
