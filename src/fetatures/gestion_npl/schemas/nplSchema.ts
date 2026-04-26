import z from 'zod';
import {
  NPL_ESTADOS,
  NPL_TIPOS_INMUEBLE,
  NPL_PROCEDIMIENTOS,
} from '../types/npl.types';

// ─── Sección A: Superficies y datos registrales ───────────────────────────────

const NplSectionASchema = z.object({
  tituloOperacion: z
    .string()
    .trim()
    .min(3, { error: 'El título de la operación es obligatorio' })
    .max(255, { error: 'El título no puede superar los 255 caracteres' }),
  referenciaOrigen: z.string().trim().max(100).optional().or(z.literal('')),
  direccion: z.string().trim().max(255).optional().or(z.literal('')),
  municipio: z.string().trim().max(100).optional().or(z.literal('')),
  provincia: z.string().trim().max(100).optional().or(z.literal('')),
  codigoPostal: z.string().trim().max(10).optional().or(z.literal('')),
  tipoInmueble: z.enum(NPL_TIPOS_INMUEBLE, {
    error: 'Selecciona un tipo de inmueble válido',
  }),
  distribucion: z.string().trim().optional().or(z.literal('')),
  superficieConst: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(parseFloat(v)), {
      message: 'Introduce un número válido',
    }),
  superficieParcela: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(parseFloat(v)), {
      message: 'Introduce un número válido',
    }),
  superficieDetalles: z.string().trim().optional().or(z.literal('')),
  anyConstruccion: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{4}$/.test(v), {
      message: 'Introduce un año válido (4 dígitos)',
    }),
  refCatastral: z.string().trim().max(50).optional().or(z.literal('')),
  fincaRegistral: z.string().trim().max(100).optional().or(z.literal('')),
  datosRegistro: z.string().trim().optional().or(z.literal('')),
  tasacionSubasta: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(parseFloat(v)), {
      message: 'Introduce un número válido',
    }),
  imagenAsociada: z.string().trim().max(255).optional().or(z.literal('')),
  imagenesAdicionales: z.array(z.string()).default([]),
});

// ─── Sección B: Rentabilidad ──────────────────────────────────────────────────

const NplSectionBSchema = z.object({
  costeAdquisicionCredito: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(parseFloat(v)), {
      message: 'Introduce un número válido',
    }),
  derechoCobroPrincipal: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(parseFloat(v)), {
      message: 'Introduce un número válido',
    }),
  intereses: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(parseFloat(v)), {
      message: 'Introduce un número válido',
    }),
  costas: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(parseFloat(v)), {
      message: 'Introduce un número válido',
    }),
  impuestosAjd: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(parseFloat(v)), {
      message: 'Introduce un número válido',
    }),
  costesNotariaRegistro: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(parseFloat(v)), {
      message: 'Introduce un número válido',
    }),
  gastosDacion: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(parseFloat(v)), {
      message: 'Introduce un número válido',
    }),
  precioMercado: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(parseFloat(v)), {
      message: 'Introduce un número válido',
    }),
  precioVentaRapida: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(parseFloat(v)), {
      message: 'Introduce un número válido',
    }),
});

// ─── Sección C: Estado real y procesal ───────────────────────────────────────

const NplSectionCSchema = z.object({
  procedimiento: z.enum(NPL_PROCEDIMIENTOS).optional(),
  nig: z.string().trim().max(50).optional().or(z.literal('')),
  juzgado: z.string().trim().max(255).optional().or(z.literal('')),
  ejecutante: z.string().trim().max(255).optional().or(z.literal('')),
  procuradores: z.array(z.string()).default([]),
  ejecutados: z.array(z.string()).default([]),
  autoDespachoJuez: z.string().trim().optional().or(z.literal('')),
  prestamoHipotecaDetalles: z.string().trim().optional().or(z.literal('')),
  importeDespachado: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(parseFloat(v)), {
      message: 'Introduce un número válido',
    }),
  actuacionesSeguidas: z.string().trim().optional().or(z.literal('')),
  informacionInversor: z.string().trim().optional().or(z.literal('')),
});

// ─── Sección D: Deudores ─────────────────────────────────────────────────────
// Los deudores se gestionan en la feature npl_deudores.
// Esta sección no tiene campos propios en el formulario NPL.

// ─── Control ──────────────────────────────────────────────────────────────────

const NplControlSchema = z.object({
  estado: z.enum(NPL_ESTADOS, { error: 'Estado no válido' }),
  esPublico: z.boolean().default(false),
});

// ─── Schema completo ──────────────────────────────────────────────────────────

export const NplSchema = NplSectionASchema.merge(NplSectionBSchema)
  .merge(NplSectionCSchema)
  .merge(NplControlSchema);

export type NplInput = z.input<typeof NplSchema>;

export const UpdateNplEstadoSchema = z.object({
  estado: z.enum(NPL_ESTADOS, { error: 'Estado no válido' }),
});

export type UpdateNplEstadoInput = z.infer<typeof UpdateNplEstadoSchema>;
